$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$labDirectories = @(
    'Lab1',
    'Lab2',
    'Lab3-1',
    'Lab3-2',
    'Lab4',
    'Lab5',
    'Lab6-1',
    'Lab6-2',
    'Lab7',
    'Lab8-1',
    'Lab8-2',
    'Lab9',
    'Lab10',
    'Lab11',
    'Lab12'
)

$browserExtensions = @('.html', '.htm', '.xml')
$assetExtensions = @('.css', '.js', '.jpg', '.jpeg', '.png', '.gif', '.svg')
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Encode-Html([string] $value) {
    return [System.Net.WebUtility]::HtmlEncode($value)
}

function Encode-Path([string] $value) {
    return (($value -replace '\\', '/') -split '/' | ForEach-Object {
        [Uri]::EscapeDataString($_)
    }) -join '/'
}

function New-FileList([array] $files, [string] $labName, [string] $kind) {
    $items = foreach ($file in $files) {
        $relativePath = $file.FullName.Substring((Join-Path $repoRoot $labName).Length + 1)
        $encodedRelativePath = Encode-Path $relativePath
        $displayPath = Encode-Html ($relativePath -replace '\\', ' / ')
        $fileLabel = if ([string]::IsNullOrWhiteSpace($file.BaseName)) { $file.Name } else { $file.BaseName }
        $displayName = Encode-Html $fileLabel

        if ($kind -eq 'browser' -and $file.Extension.ToLowerInvariant() -eq '.xml') {
            $viewerTarget = [Uri]::EscapeDataString("$labName/$($relativePath -replace '\\', '/')")
            $href = "../document-viewer.html?file=$viewerTarget"
            $action = 'Open original page'
        } elseif ($kind -eq 'browser') {
            $href = $encodedRelativePath
            $action = 'Open original page'
        } elseif ($kind -eq 'asset') {
            $href = $encodedRelativePath
            $action = 'Open original file'
        } elseif ($file.Extension.ToLowerInvariant() -eq '.php') {
            $runnerTarget = [Uri]::EscapeDataString("$labName/$($relativePath -replace '\\', '/')")
            $href = "../php-runner.html?ui=4&file=$runnerTarget"
            $action = 'Run live browser simulation'
        } else {
            $href = $encodedRelativePath
            $action = 'Open original course file'
        }

        "                <li><a href=`"$href`">$displayName</a><small>$displayPath &middot; $action</small></li>"
    }

    return $items -join [Environment]::NewLine
}

foreach ($labName in $labDirectories) {
    $labPath = Join-Path $repoRoot $labName
    $allFiles = Get-ChildItem -LiteralPath $labPath -Recurse -File |
        Where-Object {
            $_.Name -ne 'index.html' -and
            $_.FullName -notmatch '[\\/]nbproject[\\/]'
        } |
        Sort-Object FullName

    $browserFiles = @($allFiles | Where-Object { $browserExtensions -contains $_.Extension.ToLowerInvariant() })
    $phpFiles = @($allFiles | Where-Object { $_.Extension.ToLowerInvariant() -eq '.php' })
    $assetFiles = @($allFiles | Where-Object { $assetExtensions -contains $_.Extension.ToLowerInvariant() })
    $otherFiles = @($allFiles | Where-Object {
        $extension = $_.Extension.ToLowerInvariant()
        $browserExtensions -notcontains $extension -and
        $assetExtensions -notcontains $extension -and
        $extension -ne '.php'
    })

    $sections = New-Object System.Collections.Generic.List[string]

    if ($browserFiles.Count -gt 0) {
        $list = New-FileList $browserFiles $labName 'browser'
        $sections.Add("        <section class=`"file-group`"><h2>Browser pages</h2><ul class=`"file-list`">$([Environment]::NewLine)$list$([Environment]::NewLine)            </ul></section>")
    }

    if ($phpFiles.Count -gt 0) {
        $list = New-FileList $phpFiles $labName 'source'
        $sections.Add("        <section class=`"file-group`"><h2>PHP source</h2><p class=`"note`">These lessons run inside the browser using a WebAssembly PHP runtime.</p><ul class=`"file-list`">$([Environment]::NewLine)$list$([Environment]::NewLine)            </ul></section>")
    }

    if ($assetFiles.Count -gt 0) {
        $list = New-FileList $assetFiles $labName 'asset'
        $sections.Add("        <section class=`"file-group`"><h2>Supporting assets</h2><ul class=`"file-list`">$([Environment]::NewLine)$list$([Environment]::NewLine)            </ul></section>")
    }

    if ($otherFiles.Count -gt 0) {
        $list = New-FileList $otherFiles $labName 'source'
        $sections.Add("        <section class=`"file-group`"><h2>Other course files</h2><ul class=`"file-list`">$([Environment]::NewLine)$list$([Environment]::NewLine)            </ul></section>")
    }

    $encodedLabName = Encode-Html $labName
    $sectionMarkup = $sections -join ([Environment]::NewLine + [Environment]::NewLine)
    $page = @"
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>$encodedLabName &middot; 2019.2 Web Programming</title>
    <link rel="stylesheet" href="../lab-index.css">
</head>
<body>
    <main class="lab-page">
        <a class="back-link" href="../">&larr; All labs</a>
        <h1>$encodedLabName</h1>
        <p>This page indexes the original files in this lab. No exercise code has been rewritten.</p>
$sectionMarkup
    </main>
    <script src="../lab-navigation.js?v=4" data-course-navigation defer></script>
</body>
</html>
"@

    [System.IO.File]::WriteAllText((Join-Path $labPath 'index.html'), $page, $utf8NoBom)
}

$runtimeExtensions = @('.php', '.html', '.htm', '.xml', '.css', '.js', '.htaccess')
$runtimeFiles = foreach ($labName in $labDirectories) {
    Get-ChildItem -LiteralPath (Join-Path $repoRoot $labName) -Recurse -File |
        Where-Object {
            $_.Name -ne 'index.html' -and
            $runtimeExtensions -contains $_.Extension.ToLowerInvariant() -and
            $_.FullName -notmatch '[\\/]nbproject[\\/]'
        } |
        ForEach-Object {
            ($_.FullName.Substring($repoRoot.Length + 1) -replace '\\', '/')
        }
}

$manifest = @{ files = @($runtimeFiles | Sort-Object -Unique) } | ConvertTo-Json -Depth 3
[System.IO.File]::WriteAllText((Join-Path $repoRoot 'course-files.json'), $manifest, $utf8NoBom)

Write-Output "Generated $($labDirectories.Count) lab index pages and a $($runtimeFiles.Count)-file PHP runtime manifest."
