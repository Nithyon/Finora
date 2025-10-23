$mavenPath = "C:\maven\bin"
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")

if ($currentPath -notlike "*maven*") {
    $newPath = $currentPath + ";" + $mavenPath
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "✅ Maven added to PATH: $mavenPath"
} else {
    Write-Host "✅ Maven already in PATH"
}

# Refresh environment
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")

Write-Host ""
Write-Host "Verifying Maven:"
& "C:\maven\bin\mvn" --version
