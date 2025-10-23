@echo off
REM Start Java Analytics Service

echo.
echo ========================================
echo   Finora Java Analytics Service
echo ========================================
echo.

REM Set Java path
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=C:\maven\bin;%PATH%

echo JAVA_HOME: %JAVA_HOME%
echo Maven: C:\maven\bin

REM Navigate to backend-java
cd /d c:\Users\saini\Documents\finora\backend-java

echo.
echo Starting service...
echo.

C:\maven\bin\mvn.cmd spring-boot:run

pause
