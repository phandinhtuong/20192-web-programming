$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$closingBody = New-Object System.Text.RegularExpressions.Regex('</body>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$navigationVersion = 'v=9'
$navigationSource = New-Object System.Text.RegularExpressions.Regex('(?<prefix>src=["''][^"'']*lab-navigation\.js)(?:\?v=[^"'']*)?(?<suffix>["''])', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$updated = 0
$unchanged = 0

$pages = Get-ChildItem -LiteralPath $repoRoot -Recurse -File |
    Where-Object {
        $_.Extension.ToLowerInvariant() -in @('.html', '.htm') -and
        $_.FullName -notmatch '[\\/]\.git[\\/]' -and
        $_.FullName -notmatch '[\\/]nbproject[\\/]'
    }

foreach ($page in $pages) {
    $content = [System.IO.File]::ReadAllText($page.FullName)
    if ($content.Contains('data-course-navigation')) {
        $versionedContent = $navigationSource.Replace($content, {
            param($match)
            return $match.Groups['prefix'].Value + '?' + $navigationVersion + $match.Groups['suffix'].Value
        })
        if ($versionedContent -ne $content) {
            [System.IO.File]::WriteAllText($page.FullName, $versionedContent, $utf8NoBom)
            $updated++
        } else {
            $unchanged++
        }
        continue
    }

    $relativePath = $page.FullName.Substring($repoRoot.Length + 1)
    $directoryDepth = ($relativePath -split '[\\/]').Count - 1
    $scriptPath = ('../' * $directoryDepth) + 'lab-navigation.js?' + $navigationVersion
    $scriptTag = "    <script src=`"$scriptPath`" data-course-navigation defer></script>"

    if ($closingBody.IsMatch($content)) {
        $content = $closingBody.Replace($content, "$scriptTag`r`n</body>", 1)
    } else {
        $content += "`r`n$scriptTag`r`n"
    }

    [System.IO.File]::WriteAllText($page.FullName, $content, $utf8NoBom)
    $updated++
}

Write-Output "Navigation added to $updated pages; $unchanged pages already contained it."
