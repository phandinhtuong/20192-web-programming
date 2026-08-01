import { startPlaygroundWeb } from 'https://playground.wordpress.net/client/index.js';

const courseRoot = new URL('./', window.location.href);
const params = new URLSearchParams(window.location.search);
const requestedFile = params.get('file') || '';
const requestedMethod = (params.get('method') || 'GET').toUpperCase() === 'POST' ? 'POST' : 'GET';
const requestedFields = new URLSearchParams(params.get('data') || '');
const targetFile = normalizeTarget(requestedFile);
const outputFrame = document.getElementById('lesson-output');
const engineFrame = document.getElementById('php-engine');
const status = document.getElementById('runtime-status');
const statusDetail = document.getElementById('status-detail');
const runtimeLabel = document.getElementById('runtime-label');
const lessonTitle = document.getElementById('lesson-title');
const reloadButton = document.getElementById('reload-lesson');
let activeFile = targetFile;
let playground;
let manifestPromise;
const labStagePromises = new Map();

lessonTitle.textContent = lessonName(targetFile);
document.title = `${lessonName(targetFile)} · PHP Lesson Simulation`;

reloadButton.addEventListener('click', () => runPHP(activeFile, 'GET', new URLSearchParams()));

const bootPromise = boot();
bootPromise.catch(error => {
    showError(error);
});

window.addEventListener('course:php-navigate', event => {
    navigateToRunnerUrl(new URL(event.detail.url), false);
});

window.addEventListener('popstate', () => {
    navigateToRunnerUrl(new URL(window.location.href), false);
});

async function boot() {
    setStatus('Starting PHP 7.4', 'Downloading the browser runtime. The first lesson may take several seconds…');
    playground = await startPlaygroundWeb({
        iframe: engineFrame,
        remoteUrl: 'https://playground.wordpress.net/remote.html',
        blueprint: {
            preferredVersions: { php: '7.4', wp: 'latest' },
            steps: []
        }
    });

    if (typeof playground.isReady === 'function') {
        await playground.isReady();
    } else {
        await playground.isReady;
    }

    await stageRuntimeCompatibility();
    reloadButton.disabled = false;
    await runPHP(targetFile, requestedMethod, requestedFields);
}

async function stageRuntimeCompatibility() {
    const response = await fetch(new URL('php-database-compat.php', courseRoot));
    if (!response.ok) throw new Error('The browser database compatibility layer could not be loaded.');
    const data = new Uint8Array(await response.arrayBuffer());
    await playground.mkdirTree('/tmp/course-runtime');
    await playground.writeFile('/tmp/course-runtime/database.php', data);
}

async function navigateToRunnerUrl(url, addHistory) {
    const file = normalizeTarget(url.searchParams.get('file') || '');
    const method = (url.searchParams.get('method') || 'GET').toUpperCase() === 'POST' ? 'POST' : 'GET';
    const fields = new URLSearchParams(url.searchParams.get('data') || '');
    if (addHistory) {
        window.history.pushState({}, '', url);
    }
    await bootPromise;
    await runPHP(file, method, fields);
}

function navigateWithinRunner(file, method, fields) {
    const url = new URL('php-runner.html', courseRoot);
    url.searchParams.set('ui', '6');
    url.searchParams.set('file', normalizeTarget(file));
    url.searchParams.set('method', method);
    if (fields.toString()) {
        url.searchParams.set('data', fields.toString());
    }
    window.history.pushState({}, '', url);
    window.dispatchEvent(new CustomEvent('course:location-sync', {
        detail: { url: url.href }
    }));
    return runPHP(file, method, fields);
}

function ensureLabFiles(lab) {
    if (!labStagePromises.has(lab)) {
        labStagePromises.set(lab, stageLabFiles(lab));
    }
    return labStagePromises.get(lab);
}

async function stageLabFiles(lab) {
    if (!manifestPromise) {
        manifestPromise = fetch(new URL('course-files.json', courseRoot)).then(response => {
            if (!response.ok) throw new Error('The course runtime manifest could not be loaded.');
            return response.json();
        });
    }
    const manifest = await manifestPromise;
    const labFiles = manifest.files.filter(path => path.startsWith(`${lab}/`));
    if (!labFiles.length) throw new Error(`No runtime files were found for ${lab}.`);

    await playground.mkdirTree(`/tmp/course/${lab}`);
    for (let index = 0; index < labFiles.length; index += 1) {
        const path = labFiles[index];
        statusDetail.textContent = `Preparing ${index + 1} of ${labFiles.length}: ${path}`;
        const response = await fetch(new URL(encodePath(path), courseRoot));
        if (!response.ok) throw new Error(`Unable to load ${path}.`);
        let data = new Uint8Array(await response.arrayBuffer());
        if (path.startsWith('Lab6-1/') && path.toLowerCase().endsWith('.php')) {
            const source = new TextDecoder().decode(data).replace(
                /\bmysqli_(connect|select_db|query|fetch_row|close)\b/g,
                'course_mysqli_$1'
            );
            data = new TextEncoder().encode(source);
        }
        const virtualPath = `/tmp/course/${path}`;
        await playground.mkdirTree(virtualPath.substring(0, virtualPath.lastIndexOf('/')));
        await playground.writeFile(virtualPath, data);
    }

    if (lab === 'Lab6-2') {
        await playground.writeFile(
            '/tmp/course/Lab6-2/DB.php',
            new TextEncoder().encode('<?php // PEAR DB compatibility is preloaded by the course runtime. ?>')
        );
    }
}

async function runPHP(file, method, fields) {
    activeFile = normalizeTarget(file);
    lessonTitle.textContent = lessonName(activeFile);
    document.title = `${lessonName(activeFile)} · PHP Lesson Simulation`;
    reloadButton.disabled = true;

    const activeLab = activeFile.split('/')[0];
    if (!labStagePromises.has(activeLab)) {
        setStatus('Loading course files', `Preparing ${activeLab} inside the existing PHP runtime…`);
    }

    try {
        await ensureLabFiles(activeLab);
        setStatus('Running lesson', `Executing ${activeFile}…`);
        runtimeLabel.textContent = 'Executing PHP';

        const query = method === 'GET' ? fields.toString() : '';
        const post = method === 'POST' ? fields.toString() : '';
        const virtualFile = `/tmp/course/${activeFile}`;
        const code = `<?php
ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_WARNING);
require_once '/tmp/course-runtime/database.php';
$_SERVER['REQUEST_METHOD'] = '${method}';
$_SERVER['PHP_SELF'] = '/${escapePHP(activeFile)}';
parse_str(base64_decode('${encodeBase64(query)}'), $_GET);
parse_str(base64_decode('${encodeBase64(post)}'), $_POST);
$_REQUEST = array_merge($_GET, $_POST);
chdir(dirname('${escapePHP(virtualFile)}'));
include '${escapePHP(virtualFile)}';
?>`;

        const response = await playground.run({ code });
        renderOutput(response.text || '', response.errors || '', activeFile);
        status.classList.add('ready');
        runtimeLabel.textContent = 'PHP 7.4 · Browser runtime';
    } catch (error) {
        showError(error);
    } finally {
        reloadButton.disabled = false;
    }
}

function renderOutput(html, errors, file) {
    const baseUrl = new URL(`${file.substring(0, file.lastIndexOf('/') + 1)}`, courseRoot);
    const errorMarkup = errors
        ? `<pre style="margin:16px;padding:12px;border:1px solid #efc5c2;background:#fff1ef;color:#8e2d26;white-space:pre-wrap">${escapeHTML(errors)}</pre>`
        : '';
    const content = html || (!errors
        ? '<p style="font-family:sans-serif;padding:20px">The lesson completed without producing visible output.</p>'
        : '');
    const documentMarkup = /<html[\s>]/i.test(content)
        ? content
            .replace(/<head([^>]*)>/i, `<head$1><base href="${baseUrl.href}">`)
            .replace(/<\/body>/i, `${errorMarkup}</body>`)
        : `<!doctype html><html><head><base href="${baseUrl.href}"></head><body>${content}${errorMarkup}</body></html>`;

    outputFrame.onload = () => connectRenderedPage(file);
    outputFrame.srcdoc = documentMarkup;
}

function connectRenderedPage(renderedFile) {
    const renderedDocument = outputFrame.contentDocument;
    if (!renderedDocument) return;
    const baseUrl = new URL(`${renderedFile.substring(0, renderedFile.lastIndexOf('/') + 1)}`, courseRoot);

    renderedDocument.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', event => {
            const action = form.getAttribute('action') || renderedFile.substring(renderedFile.lastIndexOf('/') + 1);
            const actionUrl = new URL(action, baseUrl);
            if (!actionUrl.pathname.toLowerCase().endsWith('.php')) return;
            event.preventDefault();
            const destination = decodeURIComponent(actionUrl.pathname.substring(courseRoot.pathname.length));
            const method = (form.getAttribute('method') || 'GET').toUpperCase();
            navigateWithinRunner(destination, method, new URLSearchParams(new FormData(form)));
        });
    });

    renderedDocument.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', event => {
            const destinationUrl = new URL(link.getAttribute('href'), baseUrl);
            if (destinationUrl.origin !== window.location.origin || !destinationUrl.pathname.toLowerCase().endsWith('.php')) return;
            event.preventDefault();
            const destination = decodeURIComponent(destinationUrl.pathname.substring(courseRoot.pathname.length));
            navigateWithinRunner(destination, 'GET', destinationUrl.searchParams);
        });
    });
}

function setStatus(title, detail) {
    status.classList.remove('ready', 'error');
    status.querySelector('strong').textContent = title;
    statusDetail.textContent = detail;
}

function showError(error) {
    status.classList.remove('ready');
    status.classList.add('error');
    status.querySelector('strong').textContent = 'Simulation could not start';
    statusDetail.textContent = error instanceof Error ? error.message : String(error);
    runtimeLabel.textContent = 'Runtime error';
    reloadButton.disabled = true;
}

function normalizeTarget(path) {
    const normalized = decodeURIComponent(path).replace(/\\/g, '/').replace(/^\/+/, '');
    if (!/^Lab[\w.-]+\/[\w./-]+\.php$/i.test(normalized) || normalized.includes('..')) {
        throw new Error('A valid PHP lesson was not selected.');
    }
    return normalized;
}

function lessonName(path) {
    return path.substring(path.lastIndexOf('/') + 1).replace(/\.php$/i, '');
}

function encodePath(path) {
    return path.split('/').map(segment => encodeURIComponent(segment)).join('/');
}

function encodeBase64(value) {
    const bytes = new TextEncoder().encode(value);
    let binary = '';
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary);
}

function escapePHP(value) {
    return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function escapeHTML(value) {
    return value.replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
}
