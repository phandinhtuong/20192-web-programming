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
        ':host{all:initial;display:block;position:sticky;top:0;z-index:2147483647}',
        '*{box-sizing:border-box}',
        'nav{display:flex;align-items:center;gap:14px;min-height:52px;padding:8px 16px;color:#fff;background:#172033;border-bottom:3px solid #5d8ee8;font:14px/1.3 Arial,Helvetica,sans-serif;box-shadow:0 2px 7px rgba(0,0,0,.18)}',
        'a{color:#fff;text-decoration:none}',
        'a:hover,a:focus{text-decoration:underline}',
        '.brand{font-weight:700;white-space:nowrap}',
        '.crumbs{display:flex;align-items:center;gap:7px;min-width:0;color:#c9d2e3}',
        '.crumbs a{color:#dce6f8}',
        '.page{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
        '.spacer{flex:1}',
        '.pager{display:flex;gap:8px;white-space:nowrap}',
        '.pager a{display:inline-flex;align-items:center;min-height:32px;padding:5px 10px;border:1px solid #72809a;border-radius:4px;background:#222e45}',
        '.pager a[hidden]{display:none}',
        '@media(max-width:650px){nav{gap:8px;padding:7px 10px}.brand{font-size:0}.brand:after{content:"2019.2";font-size:13px}.crumbs .page{display:none}.pager a{padding:5px 8px}.pager .label{display:none}}',
        '</style>',
        '<nav>',
        '  <a class="brand" href="' + courseRoot.href + '">2019.2 Web Programming</a>',
        '  <span class="crumbs"><a href="' + courseRoot.href + '">All labs</a><span aria-hidden="true">/</span><a href="' + labUrl.href + '">' + escapeHtml(labName) + '</a><span aria-hidden="true">/</span><span class="page">' + escapeHtml(pageName) + '</span></span>',
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
