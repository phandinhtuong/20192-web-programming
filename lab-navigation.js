(function () {
    'use strict';

    var script = document.currentScript;
    if (!script || document.getElementById('course-page-navigation')) {
        return;
    }

    var courseRoot = new URL('./', script.src);
    var currentUrl = new URL(window.location.href);
    var relativePath = decodeURIComponent(currentUrl.pathname.substring(courseRoot.pathname.length));
    var pathParts = relativePath.split('/').filter(Boolean);
    var labName = pathParts[0] || 'Labs';
    var pageName = (pathParts[pathParts.length - 1] || '').replace(/\.[^.]+$/, '');
    var labUrl = new URL(encodeURIComponent(labName) + '/', courseRoot);

    var host = document.createElement('div');
    host.id = 'course-page-navigation';
    host.setAttribute('role', 'navigation');
    host.setAttribute('aria-label', 'Course navigation');

    var shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = [
        '<style>',
        ':host{all:initial;display:block;position:sticky;top:0;z-index:2147483647;width:100vw;margin-left:calc(50% - 50vw);background:#fff}',
        '*{box-sizing:border-box}',
        'nav{display:flex;align-items:center;gap:30px;width:min(1200px,calc(100% - 40px));min-height:66px;margin:0 auto;color:#171717;background:#fff;font:14px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}',
        ':host:after{content:"";display:block;height:1px;background:#e5e7eb}',
        'a{color:#171717;text-decoration:none}',
        'a:hover,a:focus{color:#075fbd}',
        '.brand{display:inline-flex;align-items:center;gap:10px;font-size:18px;font-weight:700;white-space:nowrap;letter-spacing:-.02em}',
        '.mark{display:grid;width:34px;height:34px;place-items:center;border-radius:50%;color:#fff;background:#1479be;font:700 11px/1 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:-.08em}',
        '.crumbs{display:flex;align-items:center;gap:20px;min-width:0;color:#6b7280}',
        '.crumbs a{color:#292929}',
        '.slash{display:none}',
        '.page{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
        '.spacer{flex:1}',
        '.pager{display:flex;gap:10px;white-space:nowrap}',
        '.pager a{display:inline-flex;align-items:center;justify-content:center;min-height:36px;padding:6px 14px;border:1px solid #0867c5;border-radius:4px;color:#075fbd;background:#fff;font-weight:600;transition:background .15s,color .15s}',
        '.pager a:hover,.pager a:focus{color:#fff;background:#075fbd;text-decoration:none}',
        '.pager #next-page{color:#fff;background:#075fbd}',
        '.pager #next-page:hover,.pager #next-page:focus{background:#064f9c}',
        '.pager a[hidden]{display:none}',
        '@media(max-width:760px){nav{gap:14px;width:calc(100% - 24px);min-height:60px}.brand{font-size:0}.brand:after{content:"Web Programming";font-size:15px}.mark{width:31px;height:31px}.crumbs{display:none}.pager{margin-left:auto}.pager a{min-height:34px;padding:5px 10px}.pager .label{display:none}}',
        '@media(max-width:420px){.brand:after{content:"2019.2"}.pager a{padding:5px 8px}}',
        '</style>',
        '<nav>',
        '  <a class="brand" href="' + courseRoot.href + '"><span class="mark" aria-hidden="true">&lt;/&gt;</span><span>Web Programming</span></a>',
        '  <span class="crumbs"><a href="' + courseRoot.href + '">Home</a><a href="' + labUrl.href + '">' + escapeHtml(labName) + '</a><span class="page">' + escapeHtml(pageName) + '</span></span>',
        '  <span class="spacer"></span>',
        '  <span class="pager"><a id="previous-page" hidden><span aria-hidden="true">&larr;&nbsp;</span><span class="label">Previous</span></a><a id="next-page" hidden><span class="label">Next</span><span aria-hidden="true">&nbsp;&rarr;</span></a></span>',
        '</nav>'
    ].join('');

    document.body.insertBefore(host, document.body.firstChild);

    fetch(labUrl.href)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Unable to load lab index');
            }
            return response.text();
        })
        .then(function (html) {
            var indexDocument = new DOMParser().parseFromString(html, 'text/html');
            var links = Array.prototype.slice.call(indexDocument.querySelectorAll('.file-group:first-of-type .file-list a'));
            var pages = links.map(function (link) {
                return {
                    href: new URL(link.getAttribute('href'), labUrl).href,
                    path: new URL(link.getAttribute('href'), labUrl).pathname,
                    label: link.textContent.trim()
                };
            });
            var currentIndex = pages.findIndex(function (page) {
                return decodeURIComponent(page.path) === decodeURIComponent(currentUrl.pathname);
            });

            if (currentIndex > 0) {
                configurePager(shadow.getElementById('previous-page'), pages[currentIndex - 1]);
            }
            if (currentIndex >= 0 && currentIndex < pages.length - 1) {
                configurePager(shadow.getElementById('next-page'), pages[currentIndex + 1]);
            }
        })
        .catch(function () {
            // Course and lab links remain available if the index cannot be fetched.
        });

    function configurePager(link, page) {
        link.href = page.href;
        link.title = page.label;
        link.hidden = false;
    }

    function escapeHtml(value) {
        return value.replace(/[&<>'"]/g, function (character) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[character];
        });
    }
}());
