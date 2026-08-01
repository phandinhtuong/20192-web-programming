(function () {
    'use strict';

    var script = document.currentScript;
    if (!script || document.getElementById('course-page-navigation')) {
        return;
    }

    var SIDEBAR_WIDTH = 264;
    var courseRoot = new URL('./', script.src);
    var currentUrl = new URL(window.location.href);
    var simulatedFile = currentUrl.searchParams.get('file');
    var relativePath = simulatedFile || decodeURIComponent(currentUrl.pathname.substring(courseRoot.pathname.length));
    var currentKey = navigationKey(currentUrl);
    var pathParts = relativePath.split('/').filter(Boolean);
    var isCourseHome = pathParts.length === 0 || relativePath.toLowerCase() === 'index.html';
    var labName = isCourseHome ? 'Labs' : pathParts[0];
    var pageName = isCourseHome ? 'All labs' : pathParts[pathParts.length - 1].replace(/\.[^.]+$/, '');
    var labUrl = isCourseHome ? courseRoot : new URL(encodeURIComponent(labName) + '/', courseRoot);
    var labDirectories = [
        'Lab1', 'Lab2', 'Lab3-1', 'Lab3-2', 'Lab4', 'Lab5', 'Lab6-1', 'Lab6-2',
        'Lab7', 'Lab8-1', 'Lab8-2', 'Lab9', 'Lab10', 'Lab11', 'Lab12'
    ];
    var labCache = {};

    if (!document.getElementById('course-inter-font')) {
        var fontStylesheet = document.createElement('link');
        fontStylesheet.id = 'course-inter-font';
        fontStylesheet.rel = 'stylesheet';
        fontStylesheet.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
        document.head.appendChild(fontStylesheet);
    }

    var originalBodyPadding = document.body.style.getPropertyValue('padding-left');
    var originalBodyPaddingPriority = document.body.style.getPropertyPriority('padding-left');
    var computedBodyStyle = window.getComputedStyle(document.body);
    var initialBodyPadding = parseFloat(computedBodyStyle.paddingLeft) || 0;

    var host = document.createElement('div');
    host.id = 'course-page-navigation';
    host.setAttribute('role', 'navigation');
    host.setAttribute('aria-label', 'Course navigation');

    var shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = [
        '<style>',
        ':host{all:initial;--rw-blue:#0056b8;--rw-blue-dark:#00438f;--rw-blue-soft:#eaf3ff;--rw-green:#00a86b;--rw-canvas:#f6f8fb;--rw-line:#e4e9f0;--rw-text:#172033;--rw-muted:#667085;--rw-font:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;display:block;position:sticky;top:0;z-index:2147483647;width:100vw;margin-left:calc(50% - 50vw);background:#fff}',
        '*{box-sizing:border-box}',
        'a{color:var(--rw-text);text-decoration:none}',
        'a:hover,a:focus{color:var(--rw-blue)}',
        '.topbar{position:relative;z-index:3;border-bottom:1px solid var(--rw-line);background:rgba(255,255,255,.97);box-shadow:0 1px 2px rgba(16,24,40,.025);backdrop-filter:blur(12px)}',
        '.bar{display:flex;align-items:center;gap:18px;width:100%;min-height:64px;color:var(--rw-text);font:13px/1.4 var(--rw-font)}',
        '.brand{display:inline-flex;flex:0 0 ' + (SIDEBAR_WIDTH - 1) + 'px;align-items:center;gap:11px;align-self:stretch;padding:0 18px;border-right:1px solid var(--rw-line);font-size:14px;font-weight:700;white-space:nowrap;letter-spacing:-.01em}',
        '.mark{position:relative;width:32px;height:32px;border-radius:9px;background:var(--rw-blue);box-shadow:0 4px 10px rgba(0,86,184,.2)}',
        '.mark:before{content:"";position:absolute;inset:8px;background:linear-gradient(90deg,#fff 0 42%,transparent 42% 58%,#fff 58%),linear-gradient(#fff 0 42%,transparent 42% 58%,#fff 58%);border-radius:2px}',
        '.crumbs{display:flex;align-items:center;gap:2px;min-width:0;color:var(--rw-muted)}',
        '.crumbs a,.page{min-height:34px;padding:8px 11px;border-radius:7px}',
        '.crumbs a{position:relative;color:var(--rw-muted);font-weight:500}',
        '.crumbs a:not(:last-child):after{content:"/";position:absolute;right:-4px;color:#c0c6d0}',
        '.crumbs a:hover,.crumbs a:focus{color:var(--rw-blue);background:var(--rw-blue-soft);text-decoration:none}',
        '.page{overflow:hidden;color:#1b3557;background:#f1f6fc;font-weight:600;text-overflow:ellipsis;white-space:nowrap}',
        '.spacer{flex:1}',
        '.pager{display:flex;gap:8px;margin-right:16px;white-space:nowrap}',
        '.pager a{display:inline-flex;align-items:center;justify-content:center;min-height:34px;padding:6px 12px;border:1px solid #d8dee8;border-radius:7px;color:#475467;background:#fff;font-weight:600;box-shadow:0 1px 2px rgba(16,24,40,.04);transition:background .15s,color .15s,border-color .15s,transform .15s}',
        '.pager a:hover,.pager a:focus{border-color:#9fc4ed;color:var(--rw-blue);background:#f5f9ff;text-decoration:none;transform:translateY(-1px)}',
        '.pager #next-page{border-color:var(--rw-blue);color:#fff;background:var(--rw-blue);box-shadow:0 2px 5px rgba(0,86,184,.2)}',
        '.pager #next-page:hover,.pager #next-page:focus{background:var(--rw-blue-dark)}',
        '.pager a[hidden]{display:none}',
        '.menu-toggle{display:none;width:36px;height:36px;padding:8px;border:1px solid #d8dee8;border-radius:8px;background:#fff;cursor:pointer}',
        '.menu-toggle span{display:block;height:2px;margin:3px 0;border-radius:2px;background:#242424}',
        '.sidebar{position:fixed;z-index:2;top:65px;bottom:0;left:0;width:' + SIDEBAR_WIDTH + 'px;overflow:auto;border-right:1px solid var(--rw-line);background:#fff;color:var(--rw-text);font:13px/1.4 var(--rw-font);scrollbar-color:#cbd3df transparent;scrollbar-width:thin;transition:transform .2s ease}',
        '.sidebar::-webkit-scrollbar{width:6px}.sidebar::-webkit-scrollbar-thumb{border-radius:10px;background:#cbd3df}.sidebar::-webkit-scrollbar-track{background:transparent}',
        '.sidebar-head{padding:20px 18px 16px;border-bottom:1px solid var(--rw-line);background:#fff}',
        '.overline{margin:0 0 6px;color:var(--rw-blue);font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}',
        '.sidebar h2{margin:0;color:var(--rw-text);font-size:16px;line-height:1.25;letter-spacing:-.02em}',
        '.side-nav{padding:12px 10px 22px}',
        '.side-label{margin:20px 10px 8px;color:#98a2b3;font-size:9px;font-weight:700;letter-spacing:.11em;text-transform:uppercase}',
        '.side-link,.exercise-link{display:flex;align-items:center;gap:9px;min-height:38px;padding:8px 10px;border-radius:8px;color:#475467;transition:color .14s,background .14s}',
        '.side-link:hover,.side-link:focus,.exercise-link:hover,.exercise-link:focus{color:var(--rw-blue);background:#f2f7fd;text-decoration:none;outline:0}',
        '.side-icon{display:grid;flex:0 0 24px;height:24px;place-items:center;border:1px solid #d8dee8;border-radius:7px;color:#667085;background:#fff;font-size:9px;font-weight:700;box-shadow:0 1px 2px rgba(16,24,40,.03)}',
        '.lab-menu{display:grid;gap:2px}',
        '.lab-group{min-width:0}',
        '.lab-row{display:flex;align-items:center;gap:9px;width:100%;min-height:38px;padding:7px 9px;border:0;border-radius:8px;color:#475467;background:transparent;cursor:pointer;font:600 12px/1.35 var(--rw-font);text-align:left;transition:color .14s,background .14s}',
        '.lab-row:hover,.lab-row:focus{color:var(--rw-blue);background:#f2f7fd;outline:0}',
        '.lab-row.current{color:var(--rw-blue);background:var(--rw-blue-soft);font-weight:700}',
        '.lab-number{display:grid;flex:0 0 26px;height:25px;place-items:center;border:1px solid #d8dee8;border-radius:7px;color:#667085;background:#fff;font-size:9px;font-weight:700}',
        '.lab-row.current .lab-number{border-color:#b7d3f2;color:#fff;background:var(--rw-blue)}',
        '.lab-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
        '.chevron{margin-left:auto;color:#98a2b3;font-size:16px;transition:transform .15s}',
        '.lab-row[aria-expanded="true"] .chevron{transform:rotate(90deg)}',
        '.lesson-list{margin:4px 0 7px 18px;padding:2px 0 3px 11px;border-left:1px solid #dce5ef}',
        '.lesson-list[hidden]{display:none}',
        '.exercise-link{gap:8px;min-height:34px;padding:6px 8px;font-size:12px}',
        '.exercise-link .number{display:grid;flex:0 0 21px;height:21px;place-items:center;border-radius:6px;color:#7b8493;background:#edf0f4;font-size:8px;font-weight:700}',
        '.exercise-link .text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
        '.exercise-link.active{color:var(--rw-blue);background:var(--rw-blue-soft);box-shadow:inset 3px 0 0 var(--rw-blue);font-weight:700}',
        '.exercise-link.active .number{color:#fff;background:var(--rw-blue)}',
        '.exercise-link.php .number{color:#167452;background:#e8f7f1}',
        '.exercise-link.php.active .number{color:#fff;background:var(--rw-green)}',
        '.exercise-link.overview{color:#475467;font-weight:600}',
        '.loading{padding:10px;color:#98a2b3;font-size:12px}',
        '.overlay{display:none;position:fixed;z-index:1;inset:65px 0 0;border:0;background:rgba(15,23,42,.34);cursor:pointer}',
        '@media(max-width:900px){.bar{gap:10px;min-height:60px;padding:0 12px}.menu-toggle{display:block}.brand{flex:0 auto;align-self:auto;padding:0;border:0;font-size:0}.brand:after{content:"Web Programming";font-size:14px}.mark{width:32px;height:32px}.crumbs{display:none}.pager{margin-left:auto;margin-right:0}.pager a{min-height:34px;padding:6px 10px}.pager .label{display:none}.sidebar{top:61px;z-index:4;transform:translateX(-100%);box-shadow:14px 0 35px rgba(15,23,42,.16)}.sidebar.open{transform:translateX(0)}.overlay{inset:61px 0 0}.overlay.open{display:block}}',
        '@media(max-width:460px){.brand:after{content:"2019.2"}.pager a{padding:5px 8px}}',
        '</style>',
        '<header class="topbar">',
        '  <div class="bar">',
        '    <button class="menu-toggle" id="menu-toggle" type="button" aria-label="Open lab navigation" aria-controls="course-sidebar" aria-expanded="false"><span></span><span></span><span></span></button>',
        '    <a class="brand" href="' + courseRoot.href + '"><span class="mark" aria-hidden="true"></span><span>Web Programming</span></a>',
        '    <span class="crumbs">' + buildBreadcrumbs() + '</span>',
        '    <span class="spacer"></span>',
        '    <span class="pager"><a id="previous-page" hidden><span aria-hidden="true">&larr;&nbsp;</span><span class="label">Previous</span></a><a id="next-page" hidden><span class="label">Next</span><span aria-hidden="true">&nbsp;&rarr;</span></a></span>',
        '  </div>',
        '</header>',
        '<aside class="sidebar" id="course-sidebar" aria-label="Course labs and lessons">',
        '  <div class="sidebar-head"><p class="overline">2019.2 course</p><h2>Labs &amp; lessons</h2></div>',
        '  <div class="side-nav">',
        '    <a class="side-link" href="' + courseRoot.href + '"><span class="side-icon" aria-hidden="true">H</span><span>All labs</span></a>',
        '    <p class="side-label">Course labs</p>',
        '    <div class="lab-menu">' + buildLabMenu() + '</div>',
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
    alignHostTop();
    if (desktopLayout.addEventListener) {
        desktopLayout.addEventListener('change', applyLayout);
    } else {
        desktopLayout.addListener(applyLayout);
    }
    window.addEventListener('resize', alignHostToViewport);

    menuToggle.addEventListener('click', function () {
        setMenuOpen(!sidebar.classList.contains('open'));
    });
    overlay.addEventListener('click', function () {
        setMenuOpen(false);
    });
    shadow.addEventListener('click', function (event) {
        var link = event.target.closest && event.target.closest('a[href]');
        if (link && isPHPRunnerUrl(currentUrl)) {
            var runnerHref = link.getAttribute('data-runner-href');
            var destination = new URL(runnerHref || link.href, currentUrl);
            if (isPHPRunnerUrl(destination) && destination.searchParams.get('file')) {
                event.preventDefault();
                window.history.pushState({}, '', destination);
                setNavigationLocation(destination);
                window.dispatchEvent(new CustomEvent('course:php-navigate', {
                    detail: { url: destination.href }
                }));
            }
        }
        if (link && link.closest('.sidebar') && !desktopLayout.matches) {
            setMenuOpen(false);
        }
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            setMenuOpen(false);
        }
    });

    routePHPInteractions();
    window.addEventListener('popstate', function () {
        var nextUrl = new URL(window.location.href);
        if (isPHPRunnerUrl(nextUrl)) {
            setNavigationLocation(nextUrl);
        }
    });
    window.addEventListener('course:location-sync', function (event) {
        setNavigationLocation(new URL(event.detail.url));
    });

    Array.prototype.forEach.call(shadow.querySelectorAll('.lab-row'), function (button) {
        button.addEventListener('click', function () {
            var selectedLab = button.getAttribute('data-lab');
            var wasExpanded = button.getAttribute('aria-expanded') === 'true';
            collapseLabs();
            if (!wasExpanded) {
                expandLab(selectedLab);
            }
        });
    });

    if (!isCourseHome) {
        expandLab(labName);
        configureCurrentPager();
    }

    function applyLayout(mediaQuery) {
        if (mediaQuery.matches) {
            document.body.style.setProperty('padding-left', (initialBodyPadding + SIDEBAR_WIDTH) + 'px', 'important');
            setMenuOpen(false);
        } else {
            if (originalBodyPadding) {
                document.body.style.setProperty('padding-left', originalBodyPadding, originalBodyPaddingPriority);
            } else {
                document.body.style.removeProperty('padding-left');
            }
        }
        alignHostToViewport();
    }

    function alignHostToViewport() {
        host.style.removeProperty('margin-left');
        var renderedMargin = parseFloat(window.getComputedStyle(host).marginLeft) || 0;
        var leftOffset = host.getBoundingClientRect().left;
        host.style.marginLeft = (renderedMargin - leftOffset) + 'px';
    }

    function alignHostTop() {
        host.style.marginTop = '0px';
        host.style.marginTop = (-host.getBoundingClientRect().top) + 'px';
    }

    function setMenuOpen(isOpen) {
        sidebar.classList.toggle('open', isOpen);
        overlay.classList.toggle('open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Close lab navigation' : 'Open lab navigation');
    }

    function buildLabMenu() {
        return labDirectories.map(function (directory) {
            var isCurrent = directory === labName;
            var listId = 'lessons-' + directory.replace(/[^a-z0-9]/gi, '-');
            return [
                '<div class="lab-group">',
                '  <button class="lab-row' + (isCurrent ? ' current' : '') + '" type="button" data-lab="' + directory + '" aria-expanded="' + String(isCurrent) + '" aria-controls="' + listId + '">',
                '    <span class="lab-number">' + formatLabNumber(directory) + '</span>',
                '    <span class="lab-text">' + directory + '</span>',
                '    <span class="chevron" aria-hidden="true">&#8250;</span>',
                '  </button>',
                '  <div class="lesson-list" id="' + listId + '"' + (isCurrent ? '' : ' hidden') + '><p class="loading">Loading lessons...</p></div>',
                '</div>'
            ].join('');
        }).join('');
    }

    function formatLabNumber(directory) {
        return directory.replace(/^Lab/, '').replace('-', '.');
    }

    function buildBreadcrumbs() {
        if (isCourseHome) {
            return '<span class="page">All labs</span>';
        }
        return '<a href="' + courseRoot.href + '">Home</a>' +
            '<a href="' + labUrl.href + '">' + escapeHtml(labName) + '</a>' +
            '<span class="page">' + escapeHtml(pageName) + '</span>';
    }

    function collapseLabs() {
        Array.prototype.forEach.call(shadow.querySelectorAll('.lab-row'), function (button) {
            button.setAttribute('aria-expanded', 'false');
            shadow.getElementById(button.getAttribute('aria-controls')).hidden = true;
        });
    }

    function expandLab(directory) {
        var button = shadow.querySelector('.lab-row[data-lab="' + directory + '"]');
        if (!button) {
            return;
        }
        button.setAttribute('aria-expanded', 'true');
        shadow.getElementById(button.getAttribute('aria-controls')).hidden = false;
        loadLab(directory).then(function (data) {
            populateLessons(directory, data.lessons);
        }).catch(function () {
            getLessonContainer(directory).innerHTML = '<p class="loading">Lessons unavailable.</p>';
        });
    }

    function loadLab(directory) {
        if (labCache[directory]) {
            return labCache[directory];
        }

        var indexUrl = new URL(encodeURIComponent(directory) + '/', courseRoot);
        labCache[directory] = fetch(indexUrl.href)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Unable to load ' + directory);
                }
                return response.text();
            })
            .then(function (html) {
                var indexDocument = new DOMParser().parseFromString(html, 'text/html');
                var lessons = [];
                var browserPages = [];

                Array.prototype.forEach.call(indexDocument.querySelectorAll('.file-group'), function (section) {
                    var heading = section.querySelector('h2');
                    var headingText = heading ? heading.textContent.trim() : '';
                    if (headingText !== 'Browser pages' && headingText !== 'PHP source') {
                        return;
                    }

                    Array.prototype.forEach.call(section.querySelectorAll('.file-list a'), function (lessonLink) {
                        var pageUrl = new URL(lessonLink.getAttribute('href'), indexUrl);
                        if (headingText === 'PHP source') {
                            pageUrl.searchParams.set('ui', '9');
                        }
                        var lesson = {
                            href: pageUrl.href,
                            path: pageUrl.pathname,
                            key: navigationKey(pageUrl),
                            label: lessonLink.textContent.trim(),
                            type: headingText === 'PHP source' ? 'php' : 'browser'
                        };
                        lessons.push(lesson);
                        if (lesson.type === 'browser') {
                            browserPages.push(lesson);
                        }
                    });
                });

                return { lessons: lessons, browserPages: browserPages };
            });

        return labCache[directory];
    }

    function getLessonContainer(directory) {
        var button = shadow.querySelector('.lab-row[data-lab="' + directory + '"]');
        return shadow.getElementById(button.getAttribute('aria-controls'));
    }

    function populateLessons(directory, lessons) {
        var container = getLessonContainer(directory);
        var indexUrl = new URL(encodeURIComponent(directory) + '/', courseRoot);
        container.textContent = '';

        var overview = document.createElement('a');
        var isOverviewActive = directory === labName &&
            decodeURIComponent(currentUrl.pathname) === decodeURIComponent(indexUrl.pathname) &&
            !simulatedFile;
        overview.className = 'exercise-link overview' + (isOverviewActive ? ' active' : '');
        overview.href = indexUrl.href;
        overview.innerHTML = '<span class="number">i</span><span class="text">Lab overview</span>';
        if (isOverviewActive) {
            overview.setAttribute('aria-current', 'page');
        }
        container.appendChild(overview);

        lessons.forEach(function (lesson, index) {
            var link = document.createElement('a');
            var isActive = directory === labName && decodeURIComponent(lesson.key) === currentKey;
            link.className = 'exercise-link ' + lesson.type + (isActive ? ' active' : '');
            setLessonHref(link, lesson.href);
            link.title = lesson.label;
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            }

            var number = document.createElement('span');
            number.className = 'number';
            number.textContent = lesson.type === 'php' ? 'P' : String(index + 1).padStart(2, '0');
            var text = document.createElement('span');
            text.className = 'text';
            text.textContent = lesson.label;
            link.appendChild(number);
            link.appendChild(text);
            container.appendChild(link);
        });
    }

    function configurePager(link, page) {
        setLessonHref(link, page.href);
        link.title = page.label;
        link.hidden = false;
    }

    function configureCurrentPager() {
        resetPager();
        loadLab(labName).then(function (data) {
            var currentIndex = data.lessons.findIndex(function (page) {
                return decodeURIComponent(page.key) === currentKey;
            });
            if (currentIndex > 0) {
                configurePager(shadow.getElementById('previous-page'), data.lessons[currentIndex - 1]);
            }
            if (currentIndex >= 0 && currentIndex < data.lessons.length - 1) {
                configurePager(shadow.getElementById('next-page'), data.lessons[currentIndex + 1]);
            }
        }).catch(function () {
            // The expanded submenu displays its own unavailable state.
        });
    }

    function resetPager() {
        ['previous-page', 'next-page'].forEach(function (id) {
            var link = shadow.getElementById(id);
            link.hidden = true;
            link.removeAttribute('href');
            link.removeAttribute('data-runner-href');
            link.removeAttribute('title');
        });
    }

    function setNavigationLocation(url) {
        currentUrl = new URL(url.href);
        simulatedFile = currentUrl.searchParams.get('file');
        relativePath = simulatedFile || decodeURIComponent(currentUrl.pathname.substring(courseRoot.pathname.length));
        currentKey = navigationKey(currentUrl);
        pathParts = relativePath.split('/').filter(Boolean);
        isCourseHome = pathParts.length === 0 || relativePath.toLowerCase() === 'index.html';
        labName = isCourseHome ? 'Labs' : pathParts[0];
        pageName = isCourseHome ? 'All labs' : pathParts[pathParts.length - 1].replace(/\.[^.]+$/, '');
        labUrl = isCourseHome ? courseRoot : new URL(encodeURIComponent(labName) + '/', courseRoot);

        shadow.querySelector('.crumbs').innerHTML = buildBreadcrumbs();
        Array.prototype.forEach.call(shadow.querySelectorAll('.lab-row'), function (button) {
            button.classList.toggle('current', button.getAttribute('data-lab') === labName);
        });
        collapseLabs();
        expandLab(labName);
        configureCurrentPager();
    }

    function navigationKey(url) {
        if ((isPHPRunnerUrl(url) || isDocumentViewerUrl(url)) && url.searchParams.get('file')) {
            return decodeURIComponent(url.pathname + '?file=' + encodeURIComponent(url.searchParams.get('file')));
        }
        return decodeURIComponent(url.pathname + url.search);
    }

    function isPHPRunnerUrl(url) {
        return url.origin === courseRoot.origin &&
            url.pathname === new URL('php-runner.html', courseRoot).pathname;
    }

    function isDocumentViewerUrl(url) {
        return url.origin === courseRoot.origin &&
            url.pathname === new URL('document-viewer.html', courseRoot).pathname;
    }

    function setLessonHref(link, href) {
        var destination = new URL(href, currentUrl);
        if (isPHPRunnerUrl(currentUrl) && isPHPRunnerUrl(destination)) {
            link.href = '#';
            link.setAttribute('data-runner-href', destination.href);
        } else {
            link.href = destination.href;
            link.removeAttribute('data-runner-href');
        }
    }

    function routePHPInteractions() {
        Array.prototype.forEach.call(document.querySelectorAll('form'), function (form) {
            form.addEventListener('submit', function (event) {
                var actionUrl = new URL(form.getAttribute('action') || currentUrl.href, currentUrl);
                if (!isCoursePHPUrl(actionUrl)) {
                    return;
                }

                event.preventDefault();
                var method = (form.getAttribute('method') || 'GET').toUpperCase();
                var formData;
                try {
                    formData = new FormData(form, event.submitter);
                } catch (error) {
                    formData = new FormData(form);
                }
                openPHPRunner(actionUrl, method, new URLSearchParams(formData));
            });
        });

        Array.prototype.forEach.call(document.querySelectorAll('a[href]'), function (link) {
            link.addEventListener('click', function (event) {
                var destination = new URL(link.getAttribute('href'), currentUrl);
                if (!isCoursePHPUrl(destination)) {
                    return;
                }
                event.preventDefault();
                openPHPRunner(destination, 'GET', destination.searchParams);
            });
        });
    }

    function isCoursePHPUrl(url) {
        return url.origin === courseRoot.origin &&
            url.pathname.indexOf(courseRoot.pathname) === 0 &&
            url.pathname.toLowerCase().endsWith('.php');
    }

    function openPHPRunner(destination, method, fields) {
        var file = decodeURIComponent(destination.pathname.substring(courseRoot.pathname.length));
        var runnerUrl = new URL('php-runner.html', courseRoot);
        runnerUrl.searchParams.set('ui', '9');
        runnerUrl.searchParams.set('file', file);
        runnerUrl.searchParams.set('method', method);
        if (fields.toString()) {
            runnerUrl.searchParams.set('data', fields.toString());
        }
        window.location.assign(runnerUrl.href);
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
