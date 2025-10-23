$javaPath = "C:\Program Files\Java\jdk-17"
$mavenPath = "C:\maven\bin"

# Set JAVA_HOME
[Environment]::SetEnvironmentVariable("JAVA_HOME", $javaPath, "User")
Write-Host "✅ JAVA_HOME set to: $javaPath"

# Add Java and Maven to PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*Java*") {
    $newPath = $currentPath + ";" + $javaPath + "\bin"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "✅ Java added to PATH"
}

# Refresh environment
$env:JAVA_HOME = $javaPath
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")

Write-Host ""
Write-Host "Verifying Java:"
& "$javaPath\bin\java.exe" -version

Write-Host ""
Write-Host "Verifying Maven:"
& "$mavenPath\mvn.cmd" --version
