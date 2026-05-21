@echo off
setlocal EnableDelayedExpansion

REM ---------- Resolve a working JDK (21 or 17 preferred, then 25) ----------
set "FOUND_JDK="
for %%V in (21 17 25) do (
    if not defined FOUND_JDK (
        for %%P in (
            "C:\Program Files\Eclipse Adoptium\jdk-%%V"
            "C:\Program Files\Microsoft\jdk-%%V"
            "C:\Program Files\Java\jdk-%%V"
            "C:\Program Files\Amazon Corretto\jdk-%%V"
            "C:\Program Files\Zulu\zulu-%%V"
        ) do (
            if exist "%%~P\bin\java.exe" set "FOUND_JDK=%%~P"
        )
    )
)

if not defined FOUND_JDK (
    echo No JDK found at common locations. Install JDK 21 LTS:
    echo    winget install --id EclipseAdoptium.Temurin.21.JDK
    exit /b 1
)

echo Using JDK: %FOUND_JDK%
set "JAVA_HOME=%FOUND_JDK%"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "APP_PROFILE=dev"

REM ---------- Build if jar missing ----------
if not exist "%~dp0target\civilsupplies-api.jar" (
    echo Building backend jar...
    call "%~dp0mvnw.cmd" -B -ntp -DskipTests package
    if errorlevel 1 (
        echo Build failed.
        exit /b 1
    )
)

REM ---------- Run ----------
echo Starting Spring Boot on http://localhost:8080 ...
java ^
    -Djava.net.preferIPv4Stack=true ^
    -jar "%~dp0target\civilsupplies-api.jar"
