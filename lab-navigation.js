(function () {
    'use strict';

    var script = document.currentScript;
    if (!script || document.getElementById('course-page-navigation')) {
        return;
    }

    var SIDEBAR_WIDTH = 244;
    var courseRoot = new URL('./', script.src);
    var currentUrl = new URL(window.location.href);
    var relativePath = decodeURIComponent(currentUrl.pathname.substring(courseRoot.pathname.length));
    var pathParts = relativePath.split('/').filter(Boolean);
    var labName = pathParts[0] || 'Labs';
    var pageName = (pathParts[pathParts.length - 1] || '').replace(/\.[^.]+$/, '');
    var labUrl = new URL(encodeURIComponent(labName) + '/', courseRoot);
    var sourceUrl = 'https://github.com/phandinhtuong/20192-web-programming/tree/phan-dinh-tuong-20164582/' + encodeURIComponent(labName);

    var originalBodyPadding = document.body.style.getPropertyValue('padding-left');
    var originalBodyPaddingPriority = document.body.style.getPropertyPriority('padding-left');
    var computedBodyStyle = window.getComputedStyle(document.body);
    var initialBodyPadding = parseFloat(computedBodyStyle.paddingLeft) || 0;
    var initialBodyMargin = parseFloat(computedBodyStyle.marginLeft) || 0;

    var host = document.createElement('div');
    host.id = 'course-page-navigation';
    host.setAttribute('role', 'navigation');
    host.setAttribute('aria-label', 'Course navigation');

    var shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = [
        '<style>',
        ':host{all:initial;display:block;position:sticky;top:0;z-index:2147483647;width:100vw;margin-left:calc(50% - 50vw);background:#fff}',
        '*{box-sizing:border-box}',
        'a{color:#171717;text-decoration:none}',
        'a:hover,a:focus{color:#075fbd}',
        '.topbar{position:relative;z-index:3;border-bottom:1px solid #e5e7eb;background:#fff}',
        '.bar{display:flex;align-items:center;gap:30px;width:calc(100% - 40px);min-height:66px;margin:0 auto;color:#171717;font:14px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}',
        '.brand{display:inline-flex;align-items:center;gap:10px;font-size:18px;font-weight:700;white-space:nowrap;letter-spacing:-.02em}',
        '.mark{display:grid;width:34px;height:34px;place-items:center;border-radius:50%;color:#fff;background:#1479be;font:700 11px/1 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:-.08em}',
        '.crumbs{display:flex;align-items:center;gap:20px;min-width:0;color:#6b7280}',
        '.crumbs a{color:#292929}',
        '.page{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
        '.spacer{flex:1}',
        '.pager{display:flex;gap:10px;white-space:nowrap}',
        '.pager a{display:inline-flex;align-items:center;justify-content:center;min-height:36px;padding:6px 14px;border:1px solid #0867c5;border-radius:4px;color:#075fbd;background:#fff;font-weight:600;transition:background .15s,color .15s}',
        '.pager a:hover,.pager a:focus{color:#fff;background:#075fbd;text-decoration:none}',
        '.pager #next-page{color:#fff;background:#075fbd}',
        '.pager #next-page:hover,.pager #next-page:focus{background:#064f9c}',
        '.pager a[hidden]{display:none}',
        '.menu-toggle{display:none;width:36px;height:36px;padding:8px;border:1px solid #d5d9e0;border-radius:5px;background:#fff;cursor:pointer}',
        '.menu-toggle span{display:block;height:2px;margin:3px 0;border-radius:2px;background:#242424}',
        '.sidebar{position:fixed;z-index:2;top:67px;bottom:0;left:0;width:' + SIDEBAR_WIDTH + 'px;overflow:auto;border-right:1px solid #e2e5e9;background:#f7f8fa;color:#252525;font:14px/1.35 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;transition:transform .2s ease}',
        '.sidebar-head{padding:23px 18px 16px;border-bottom:1px solid #e2e5e9}',
        '.overline{margin:0 0 5px;color:#7a818d;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}',
        '.sidebar h2{margin:0;font-size:20px;line-height:1.2;letter-spacing:-.02em}',
        '.side-nav{padding:12px 10px 82px}',
        '.side-label{margin:20px 10px 7px;color:#8a909a;font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase}',
        '.side-link,.exercise-link{display:flex;align-items:center;gap:10px;min-height:40px;padding:8px 10px;border-radius:5px;color:#373b42}',
        '.side-link:hover,.side-link:focus,.exercise-link:hover,.exercise-link:focus{color:#075fbd;background:#edf4fc;text-decoration:none}',
        '.side-icon{display:grid;flex:0 0 25px;height:25px;place-items:center;border:1px solid #d7dce3;border-radius:5px;color:#646b75;background:#fff;font-size:12px;font-weight:700}',
        '.exercise-link{gap:9px;min-height:36px;padding-top:6px;padding-bottom:6px;font-size:13px}',
        '.exercise-link .number{display:grid;flex:0 0 22px;height:22px;place-items:center;border-radius:5px;color:#858b94;background:#eaecf0;font-size:10px}',
        '.exercise-link .text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
        '.exercise-link.active{color:#1648b7;background:#e7e8ff;font-weight:650}',
        '.exercise-link.active .number{color:#fff;background:#3e36c8}',
        '.loading{padding:10px;color:#8a909a;font-size:12px}',
        '.source-link{position:absolute;right:10px;bottom:14px;left:10px;border:1px solid #d7dce3;background:#fff}',
        '.overlay{display:none;position:fixed;z-index:1;inset:60px 0 0;border:0;background:rgba(17,24,39,.32);cursor:pointer}',
        '@media(max-width:900px){.bar{gap:12px;width:calc(100% - 24px);min-height:60px}.menu-toggle{display:block}.brand{font-size:0}.brand:after{content:"Web Programming";font-size:15px}.mark{width:31px;height:31px}.crumbs{display:none}.pager{margin-left:auto}.pager a{min-height:34px;padding:5px 10px}.pager .label{display:none}.sidebar{top:61px;z-index:4;transform:translateX(-100%);box-shadow:10px 0 30px rgba(20,30,50,.16)}.sidebar.open{transform:translateX(0)}.overlay.open{display:block}}',
        '@media(max-width:460px){.brand:after{content:"2019.2"}.pager a{padding:5px 8px}}',
        '</style>',
        '<header class="topbar">',
        '  <div class="bar">',
        '    <button class="menu-toggle" id="menu-toggle" type="button" aria-label="Open lab navigation" aria-controls="course-sidebar" aria-expanded="false"><span></span><span></span><span></span></button>',
        '    <a class="brand" href="' + courseRoot.href + '"><span class="mark" aria-hidden="true">&lt;/&gt;</span><span>Web Programming</span></a>',
        '    <span class="crumbs"><a href="' + courseRoot.href + '">Home</a><a href="' + labUrl.href + '">' + escapeHtml(labName) + '</a><span class="page">' + escapeHtml(pageName) + '</span></span>',
        '    <span class="spacer"></span>',
        '    <span class="pager"><a id="previous-page" hidden><span aria-hidden="true">&larr;&nbsp;</span><span class="label">Previous</span></a><a id="next-page" hidden><span class="label">Next</span><span aria-hidden="true">&nbsp;&rarr;</span></a></span>',
        '  </div>',
        '</header>',
        '<aside class="sidebar" id="course-sidebar" aria-label="Lab exercises">',
        '  <div class="sidebar-head"><p class="overline">Current lab</p><h2>' + escapeHtml(labName) + '</h2></div>',
        '  <div class="side-nav">',
        '    <a class="side-link" href="' + courseRoot.href + '"><span class="side-icon" aria-hidden="true">H</span><span>All labs</span></a>',
        '    <a class="side-link" href="' + labUrl.href + '"><span class="side-icon" aria-hidden="true">L</span><span>Lab overview</span></a>',
        '    <p class="side-label">Browser exercises</p>',
        '    <div id="exercise-links"><p class="loading">Loading pages...</p></div>',
        '    <a class="side-link source-link" href="' + sourceUrl + '"><span class="side-icon" aria-hidden="true">G</span><span>Original source</span></a>',
        '  </div>',
        '</aside>',
        '<button class="overlay" id="menu-overlay" type="button" aria-label="Close lab navigation"></button>'
    ].join('');

    document.body.insertBefore(host, document.body.firstChild);

    var menuToggle = shadow.getElementById('menu-toggle');
    var sidebar = shadow.getElementById('course-sidebar');
    var overlay = shadow.getElementById('menu-overlay');
    var desktopLayout = window.matchMedia('(min-width: 901px)');

    applyLayout(desktopLayout);
    if (desktopLayout.addEventListener) {
        desktopLayout.addEventListener('change', applyLayout);
    } else {
        desktopLayout.addListener(applyLayout);
    }

    menuToggle.addEventListener('click', function () {
        setMenuOpen(!sidebar.classList.contains('open'));
    });
    overlay.addEventListener('click', function () {
        setMenuOpen(false);
    });
    shadow.addEventListener('click', function (event) {
        if (event.target.closest && event.target.closest('.sidebar a') && !desktopLayout.matches) {
            setMenuOpen(false);
        }
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            setMenuOpen(false);
        }
    });

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
                var pageUrl = new URL(link.getAttribute('href'), labUrl);
                return {
                    href: pageUrl.href,
                    path: pageUrl.pathname,
                    label: link.textContent.trim()
                };
            });
            var currentIndex = pages.findIndex(function (page) {
                return decodeURIComponent(page.path) === decodeURIComponent(currentUrl.pathname);
            });

            populateSidebar(pages, currentIndex);
            if (currentIndex > 0) {
                configurePager(shadow.getElementById('previous-page'), pages[currentIndex - 1]);
            }
            if (currentIndex >= 0 && currentIndex < pages.length - 1) {
                configurePager(shadow.getElementById('next-page'), pages[currentIndex + 1]);
            }
        })
        .catch(function () {
            shadow.getElementById('exercise-links').innerHTML = '<p class="loading">Page list unavailable.</p>';
        });

    function applyLayout(mediaQuery) {
        if (mediaQuery.matches) {
            document.body.style.setProperty('padding-left', (initialBodyPadding + SIDEBAR_WIDTH) + 'px', 'important');
            host.style.marginLeft = '-' + (initialBodyMargin + initialBodyPadding + SIDEBAR_WIDTH) + 'px';
            setMenuOpen(false);
        } else {
            if (originalBodyPadding) {
                document.body.style.setProperty('padding-left', originalBodyPadding, originalBodyPaddingPriority);
            } else {
                document.body.style.removeProperty('padding-left');
            }
            host.style.removeProperty('margin-left');
        }
    }

    function setMenuOpen(isOpen) {
        sidebar.classList.toggle('open', isOpen);
        overlay.classList.toggle('open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Close lab navigation' : 'Open lab navigation');
    }

    function populateSidebar(pages, currentIndex) {
        var container = shadow.getElementById('exercise-links');
        container.textContent = '';
        pages.forEach(function (page, index) {
            var link = document.createElement('a');
            link.className = 'exercise-link' + (index === currentIndex ? ' active' : '');
            link.href = page.href;
            link.title = page.label;
            if (index === currentIndex) {
                link.setAttribute('aria-current', 'page');
            }

            var number = document.createElement('span');
            number.className = 'number';
            number.textContent = String(index + 1).padStart(2, '0');
            var text = document.createElement('span');
            text.className = 'text';
            text.textContent = page.label;
            link.appendChild(number);
            link.appendChild(text);
            container.appendChild(link);
        });
    }

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
