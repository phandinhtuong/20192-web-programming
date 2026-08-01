(function () {
    'use strict';

    var params = new URLSearchParams(window.location.search);
    var file = normalizeFile(params.get('file') || '');
    var title = file.substring(file.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '');
    var frame = document.getElementById('document-frame');

    document.getElementById('document-title').textContent = title;
    document.getElementById('document-path').textContent = file;
    document.title = title + ' · Course Document';
    frame.src = file.split('/').map(encodeURIComponent).join('/');

    function normalizeFile(value) {
        var normalized = decodeURIComponent(value).replace(/\\/g, '/').replace(/^\/+/, '');
        if (!/^Lab[\w.-]+\/[\w./-]+\.xml$/i.test(normalized) || normalized.indexOf('..') !== -1) {
            throw new Error('A valid course document was not selected.');
        }
        return normalized;
    }
}());
