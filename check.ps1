$files = Get-ChildItem -Path "src" -Recurse -Include *.js,*.jsx

Write-Host "--- Scanning all package imports in src/ ---"
$pkgJson = Get-Content package.json | ConvertFrom-Json
$deps = $pkgJson.dependencies.psobject.properties.Name

foreach ($file in $files) {
    $lines = Get-Content $file.FullName
    foreach ($line in $lines) {
        if ($line -match 'from\s+["'']([^."''][^"'']*)["'']') {
            $importedPkg = $matches[1]
            # Get base package name (e.g. @dnd-kit/core or react-router-dom)
            $pkgBase = $importedPkg
            if ($importedPkg.StartsWith('@')) {
                $parts = $importedPkg.Split('/')
                $pkgBase = "$($parts[0])/$($parts[1])"
            } else {
                $pkgBase = $importedPkg.Split('/')[0]
            }
            
            if ($deps -notcontains $pkgBase -and $pkgBase -ne 'react' -and $pkgBase -ne 'react-dom') {
                Write-Host "WARNING: Package '$importedPkg' in $($file.Name) NOT found in dependencies!" -ForegroundColor Red
            } else {
                Write-Host "OK: $($file.Name) -> $importedPkg" -ForegroundColor Green
            }
        }
    }
}
