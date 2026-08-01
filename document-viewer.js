(function () {
    'use strict';

    var params = new URLSearchParams(window.location.search);
    var file = normalizeFile(params.get('file') || '');
    var title = file.substring(file.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '');
    var frame = document.getElementById('document-frame');
    var mode = document.getElementById('document-mode');
    var sourceUrl = file.split('/').map(encodeURIComponent).join('/');

    document.getElementById('document-title').textContent = title;
    document.getElementById('document-path').textContent = file;
    document.title = title + ' · Course Document';
    loadDocument();

    function loadDocument() {
        fetch(sourceUrl)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('The original XML document could not be loaded.');
                }
                return response.text();
            })
            .then(function (source) {
                var xml = new DOMParser().parseFromString(source, 'application/xml');
                var root = xml.documentElement;
                var rootName = root ? root.localName.toLowerCase() : '';

                if (rootName === 'svg' || rootName === 'mrow' || rootName === 'math') {
                    mode.textContent = 'Rendered lesson';
                    frame.src = sourceUrl;
                } else if (rootName === 'pages' && xml.querySelector('link > title') && xml.querySelector('link > url')) {
                    mode.textContent = 'Link directory';
                    frame.srcdoc = renderLinkDirectory(xml);
                } else {
                    mode.textContent = 'Structured XML data';
                    frame.srcdoc = renderXMLSource(source, rootName || 'xml');
                }
            })
            .catch(function (error) {
                mode.textContent = 'Document unavailable';
                frame.srcdoc = documentShell(
                    '<p class="error">' + escapeHTML(error.message || String(error)) + '</p>',
                    'Course document'
                );
            });
    }

    function renderLinkDirectory(xml) {
        var items = Array.prototype.map.call(xml.querySelectorAll('link'), function (link) {
            var linkTitle = link.querySelector('title');
            var linkUrl = link.querySelector('url');
            var label = linkTitle ? linkTitle.textContent.trim() : 'Untitled link';
            var url = linkUrl ? linkUrl.textContent.trim() : '';
            return '<li><a href="' + escapeHTML(url) + '" target="_blank" rel="noopener noreferrer">' +
                escapeHTML(label) + '</a><span>' + escapeHTML(url) + '</span></li>';
        });

        return documentShell(
            '<header><p>Search suggestion data</p><h2>Reference links</h2>' +
            '<span>' + items.length + ' entries from the original XML file</span></header>' +
            '<ul class="link-directory">' + items.join('') + '</ul>',
            'Reference links'
        );
    }

    function renderXMLSource(source, rootName) {
        return documentShell(
            '<header><p>XML data</p><h2>&lt;' + escapeHTML(rootName) + '&gt;</h2>' +
            '<span>The original structure is shown below.</span></header>' +
            '<pre><code>' + escapeHTML(source.trim()) + '</code></pre>',
            rootName + ' XML data'
        );
    }

    function documentShell(content, shellTitle) {
        return '<!doctype html><html><head><meta charset="utf-8"><title>' + escapeHTML(shellTitle) + '</title>' +
            '<style>' +
            '*{box-sizing:border-box}body{margin:0;padding:28px;color:#34363b;background:#fff;font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}' +
            'header{margin-bottom:22px}header p{margin:0 0 5px;color:#888b92;font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase}' +
            'header h2{margin:0 0 5px;color:#292a2e;font-size:25px;letter-spacing:-.025em}header span{color:#777a81;font-size:12px}' +
            '.link-directory{display:grid;gap:9px;max-width:850px;margin:0;padding:0;list-style:none}.link-directory li{padding:13px 15px;border:1px solid #e1e2e6;border-radius:6px;background:#fafafb}' +
            '.link-directory a{display:block;margin-bottom:3px;color:#3d32c5;font-size:14px;font-weight:650;text-decoration:none}.link-directory a:hover{text-decoration:underline}' +
            '.link-directory span{display:block;overflow:hidden;color:#80838a;font-size:11px;text-overflow:ellipsis;white-space:nowrap}' +
            'pre{overflow:auto;margin:0;padding:18px;border:1px solid #e1e2e6;border-radius:6px;color:#3d4048;background:#f7f7f9;font:12px/1.6 Consolas,"Courier New",monospace;white-space:pre-wrap}' +
            '.error{padding:14px;border:1px solid #efc5c2;border-radius:5px;color:#8e2d26;background:#fff1ef}' +
            '@media(max-width:600px){body{padding:18px}.link-directory span{white-space:normal}}' +
            '</style></head><body>' + content + '</body></html>';
    }

    function normalizeFile(value) {
        var normalized = decodeURIComponent(value).replace(/\\/g, '/').replace(/^\/+/, '');
        if (!/^Lab[\w.-]+\/[\w./-]+\.xml$/i.test(normalized) || normalized.indexOf('..') !== -1) {
            throw new Error('A valid course document was not selected.');
        }
        return normalized;
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            return {
                '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
            }[character];
        });
    }
}());
