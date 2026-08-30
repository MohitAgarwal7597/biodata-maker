$gitFiles = git ls-files
Write-Host "--- Checking Git Index vs Filesystem casing ---"
$issues = @()
foreach ($gf in $gitFiles) {
    $fsPath = $gf -replace '/', '\'
    if (Test-Path $fsPath) {
        $actualItem = Get-Item $fsPath
        # Get path as case-accurate string
        $segments = $gf -split '/'
        $curr = (Get-Location).Path
        $rebuilt = ""
        foreach ($s in $segments) {
            $child = Get-ChildItem -Path $curr | Where-Object { $_.Name.ToLower() -eq $s.ToLower() }
            if ($child) {
                if ($child.Name -cne $s) {
                    Write-Host "GIT CASING MISMATCH: git has '$s' but disk has '$($child.Name)' in $curr" -ForegroundColor Red
                    $issues += "$gf : git has '$s' vs disk '$($child.Name)'"
                }
                $curr = $child.FullName
            }
        }
    } else {
        Write-Host "MISSING FILE: $gf" -ForegroundColor Red
        $issues += "Missing file in git: $gf"
    }
}

if ($issues.Count -eq 0) {
    Write-Host "All Git tracked files match disk casing exactly!" -ForegroundColor Green
} else {
    Write-Host "Found $($issues.Count) issues!" -ForegroundColor Red
}
