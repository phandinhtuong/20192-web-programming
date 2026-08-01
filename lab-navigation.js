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
        ':host{all:initial;--rw-purple:#3d32c5;--rw-purple-soft:#e8e6fa;--rw-bg:#f7f7f9;--rw-line:#e2e3e7;--rw-text:#35363a;display:block;position:sticky;top:0;z-index:2147483647;width:100vw;margin-left:calc(50% - 50vw);background:#fbfbfc}',
        '*{box-sizing:border-box}',
        'a{color:#171717;text-decoration:none}',
        'a:hover,a:focus{color:var(--rw-purple)}',
        '.topbar{position:relative;z-index:3;border-bottom:1px solid var(--rw-line);background:#fbfbfc}',
        '.bar{display:flex;align-items:center;gap:14px;width:100%;min-height:58px;color:var(--rw-text);font:13px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}',
        '.brand{display:inline-flex;flex:0 0 ' + (SIDEBAR_WIDTH - 1) + 'px;align-items:center;gap:10px;align-self:stretch;padding:0 16px;border-right:1px solid var(--rw-line);font-size:15px;font-weight:650;white-space:nowrap;letter-spacing:-.01em}',
        '.mark{width:30px;height:30px;border:1px solid #e0e1e5;border-radius:6px;background-color:#fff;background-image:radial-gradient(circle,var(--rw-purple) 1.5px,transparent 1.8px);background-position:7px 7px;background-size:7px 7px;box-shadow:0 1px 2px rgba(30,35,45,.04)}',
        '.crumbs{display:flex;align-items:center;gap:4px;min-width:0;color:#74777e}',
        '.crumbs a,.page{min-height:32px;padding:7px 10px;border-radius:5px}',
        '.crumbs a{color:#60636a}',
        '.crumbs a:hover,.crumbs a:focus{color:var(--rw-purple);background:#f0eff8;text-decoration:none}',
        '.page{overflow:hidden;color:var(--rw-purple);background:var(--rw-purple-soft);font-weight:650;text-overflow:ellipsis;white-space:nowrap}',
        '.spacer{flex:1}',
        '.pager{display:flex;gap:7px;margin-right:12px;white-space:nowrap}',
        '.pager a{display:inline-flex;align-items:center;justify-content:center;min-height:32px;padding:5px 11px;border:1px solid #d7d8de;border-radius:5px;color:#60636a;background:#fff;font-weight:600;transition:background .15s,color .15s,border-color .15s}',
        '.pager a:hover,.pager a:focus{border-color:#bab5e9;color:var(--rw-purple);background:#f2f0fb;text-decoration:none}',
        '.pager #next-page{border-color:var(--rw-purple);color:#fff;background:var(--rw-purple)}',
        '.pager #next-page:hover,.pager #next-page:focus{background:#3026a9}',
        '.pager a[hidden]{display:none}',
        '.menu-toggle{display:none;width:34px;height:34px;padding:8px;border:1px solid #d7d8de;border-radius:5px;background:#fff;cursor:pointer}',
        '.menu-toggle span{display:block;height:2px;margin:3px 0;border-radius:2px;background:#242424}',
        '.sidebar{position:fixed;z-index:2;top:59px;bottom:0;left:0;width:' + SIDEBAR_WIDTH + 'px;overflow:auto;border-right:1px solid var(--rw-line);background:var(--rw-bg);color:var(--rw-text);font:13px/1.35 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;transition:transform .2s ease}',
        '.sidebar-head{padding:18px 16px 14px;border-bottom:1px solid var(--rw-line);background:#fafafb}',
        '.overline{margin:0 0 5px;color:#92959c;font-size:9px;font-weight:700;letter-spacing:.11em;text-transform:uppercase}',
        '.sidebar h2{margin:0;color:#44464c;font-size:16px;line-height:1.2;letter-spacing:-.01em}',
        '.side-nav{padding:10px 9px 78px}',
        '.side-label{margin:18px 9px 7px;color:#9a9da4;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}',
        '.side-link,.exercise-link{display:flex;align-items:center;gap:9px;min-height:36px;padding:7px 9px;border-radius:4px;color:#55585f}',
        '.side-link:hover,.side-link:focus,.exercise-link:hover,.exercise-link:focus{color:var(--rw-purple);background:#efedf9;text-decoration:none}',
        '.side-icon{display:grid;flex:0 0 23px;height:23px;place-items:center;border:1px solid #dadce1;border-radius:5px;color:#797d85;background:#fff;font-size:10px;font-weight:700}',
        '.exercise-link{gap:9px;min-height:36px;padding-top:6px;padding-bottom:6px;font-size:13px}',
        '.exercise-link .number{display:grid;flex:0 0 21px;height:21px;place-items:center;border-radius:4px;color:#8b8e96;background:#e9eaed;font-size:9px}',
        '.exercise-link .text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
        '.exercise-link.active{color:var(--rw-purple);background:var(--rw-purple-soft);font-weight:650}',
        '.exercise-link.active .number{color:#fff;background:var(--rw-purple)}',
        '.loading{padding:10px;color:#8a909a;font-size:12px}',
        '.source-link{position:absolute;right:9px;bottom:12px;left:9px;border:1px solid #dcdee3;background:#fff}',
        '.overlay{display:none;position:fixed;z-index:1;inset:60px 0 0;border:0;background:rgba(17,24,39,.32);cursor:pointer}',
        '@media(max-width:900px){.bar{gap:10px;min-height:56px;padding:0 10px}.menu-toggle{display:block}.brand{flex:0 auto;align-self:auto;padding:0;border:0;font-size:0}.brand:after{content:"Web Programming";font-size:14px}.mark{width:30px;height:30px}.crumbs{display:none}.pager{margin-left:auto;margin-right:0}.pager a{min-height:32px;padding:5px 9px}.pager .label{display:none}.sidebar{top:57px;z-index:4;transform:translateX(-100%);box-shadow:10px 0 30px rgba(20,30,50,.16)}.sidebar.open{transform:translateX(0)}.overlay.open{display:block}}',
        '@media(max-width:460px){.brand:after{content:"2019.2"}.pager a{padding:5px 8px}}',
        '</style>',
        '<header class="topbar">',
        '  <div class="bar">',
        '    <button class="menu-toggle" id="menu-toggle" type="button" aria-label="Open lab navigation" aria-controls="course-sidebar" aria-expanded="false"><span></span><span></span><span></span></button>',
        '    <a class="brand" href="' + courseRoot.href + '"><span class="mark" aria-hidden="true"></span><span>Web Programming</span></a>',
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
