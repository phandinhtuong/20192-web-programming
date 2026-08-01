(function () {
    'use strict';

    var script = document.currentScript;
    if (!script || document.getElementById('course-page-navigation')) {
        return;
    }

    var SIDEBAR_WIDTH = 244;
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
        '.side-nav{padding:10px 9px 18px}',
        '.side-label{margin:16px 9px 7px;color:#9a9da4;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}',
        '.side-link,.exercise-link{display:flex;align-items:center;gap:9px;min-height:36px;padding:7px 9px;border-radius:4px;color:#55585f}',
        '.side-link:hover,.side-link:focus,.exercise-link:hover,.exercise-link:focus{color:var(--rw-purple);background:#efedf9;text-decoration:none}',
        '.side-icon{display:grid;flex:0 0 23px;height:23px;place-items:center;border:1px solid #dadce1;border-radius:5px;color:#797d85;background:#fff;font-size:10px;font-weight:700}',
        '.lab-menu{display:grid;gap:2px}',
        '.lab-group{min-width:0}',
        '.lab-row{display:flex;align-items:center;gap:9px;width:100%;min-height:36px;padding:6px 8px;border:0;border-radius:4px;color:#55585f;background:transparent;cursor:pointer;font:600 12px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;text-align:left}',
        '.lab-row:hover,.lab-row:focus{color:var(--rw-purple);background:#efedf9;outline:0}',
        '.lab-row.current{color:var(--rw-purple);font-weight:700}',
        '.lab-number{display:grid;flex:0 0 25px;height:24px;place-items:center;border:1px solid #dadce1;border-radius:5px;color:#7f838b;background:#fff;font-size:9px;font-weight:700}',
        '.lab-row.current .lab-number{border-color:#c9c4ed;color:var(--rw-purple);background:#f2f0fb}',
        '.lab-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
        '.chevron{margin-left:auto;color:#9b9ea5;font-size:16px;transition:transform .15s}',
        '.lab-row[aria-expanded="true"] .chevron{transform:rotate(90deg)}',
        '.lesson-list{margin:2px 0 5px 16px;padding:2px 0 3px 10px;border-left:1px solid #dddbe9}',
        '.lesson-list[hidden]{display:none}',
        '.exercise-link{gap:8px;min-height:31px;padding:5px 7px;font-size:12px}',
        '.exercise-link .number{display:grid;flex:0 0 20px;height:20px;place-items:center;border-radius:4px;color:#8b8e96;background:#e9eaed;font-size:8px}',
        '.exercise-link .text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
        '.exercise-link.active{color:var(--rw-purple);background:var(--rw-purple-soft);font-weight:650}',
        '.exercise-link.active .number{color:#fff;background:var(--rw-purple)}',
        '.exercise-link.php .number{color:#7b52a8;background:#eee7f5}',
        '.exercise-link.overview{color:#6a6d74;font-weight:650}',
        '.loading{padding:10px;color:#8a909a;font-size:12px}',
        '.overlay{display:none;position:fixed;z-index:1;inset:60px 0 0;border:0;background:rgba(17,24,39,.32);cursor:pointer}',
        '@media(max-width:900px){.bar{gap:10px;min-height:56px;padding:0 10px}.menu-toggle{display:block}.brand{flex:0 auto;align-self:auto;padding:0;border:0;font-size:0}.brand:after{content:"Web Programming";font-size:14px}.mark{width:30px;height:30px}.crumbs{display:none}.pager{margin-left:auto;margin-right:0}.pager a{min-height:32px;padding:5px 9px}.pager .label{display:none}.sidebar{top:57px;z-index:4;transform:translateX(-100%);box-shadow:10px 0 30px rgba(20,30,50,.16)}.sidebar.open{transform:translateX(0)}.overlay.open{display:block}}',
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
            var destination = new URL(link.href);
            if (isPHPRunnerUrl(destination) && destination.searchParams.get('file')) {
                event.preventDefault();
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
                        var lesson = {
                            href: pageUrl.href,
                            path: pageUrl.pathname,
                            key: pageUrl.pathname + pageUrl.search,
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
            link.href = lesson.href;
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
        link.href = page.href;
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
        if (isPHPRunnerUrl(url) && url.searchParams.get('file')) {
            return decodeURIComponent(url.pathname + '?file=' + encodeURIComponent(url.searchParams.get('file')));
        }
        return decodeURIComponent(url.pathname + url.search);
    }

    function isPHPRunnerUrl(url) {
        return url.origin === courseRoot.origin &&
            url.pathname === new URL('php-runner.html', courseRoot).pathname;
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
