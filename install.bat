@echo off

set PATH=C:\Ruby25-x64\bin;%PATH%

rem set gitpath=C:\Users\danilo\AppData\Local\GitHubDesktop\app-1.5.1\resources\app\git\cmd
rem set PATH=%PATH%;%gitpath%
where /q git || ECHO The GIT is missing. Ensure it is installed and placed in your PATH. && PAUSE && EXIT /B
where /q ruby || ECHO Ruby is missing. Ensure it is installed and placed in your PATH. && PAUSE && EXIT /B
where /q py || ECHO Python is missing. Ensure it is installed and placed in your PATH. && PAUSE && EXIT /B
echo Python must be 2.x.

echo Installing Jekyll
start /wait CMD /c "gem install jekyll"
echo Installing Bundler
start /wait CMD /c "gem install bundler"
echo Installing Npm client dependencies
start /wait CMD /c "npm install --global gulp-cli"
echo Installing Bundle dependencies
start /wait CMD /c "bundle install"
echo Installing Npm libraries
start /wait CMD /c "npm install"
echo Starting site/service.
gulp