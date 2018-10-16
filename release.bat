@echo off
del /f /s /q "%cd%\..\fontEnd-CAL-mobile-release\dist\*"
mkdir "%cd%\fake"
xcopy /s /e "%cd%\dist" "%cd%\fake\"
copy /y "%cd%\index.html" "%cd%\faker.html"
move "%cd%\fake\*" "%cd%\..\fontEnd-CAL-mobile-release\dist\"
move "%cd%\faker.html" "%cd%\..\fontEnd-CAL-mobile-release\index.html"
rd /s /q "%cd%\fake"