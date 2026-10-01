@echo off


set PYTHON_HOME=C:\Program Files\Dinamica EGO 7\PyEnvironment
set npm_path=C:\Danilo\Programas\nodejs\node-v14.17.0-win-x64\
rem C:\Danilo\Programas\nodejs\node-v18.20.3-win-x64
rem set RUBY=C:\Ruby33-x64
rem C:\Danilo\Programas\rubyinstaller-3.0.3-1-x64\bin
set RUBY=C:\Ruby33-x64\bin
set gitpath=C:\Program Files\Git\cmd


set PATH=%PYTHON_HOME%;%npm_path%;%RUBY%;%gitpath%;%PATH%

where /q git || ECHO The GIT is missing. Ensure it is installed and placed in your PATH. && PAUSE && EXIT /B
where /q ruby || ECHO Ruby is missing. Ensure it is installed and placed in your PATH. && PAUSE && EXIT /B
where /q python || ECHO Python is missing. Ensure it is installed and placed in your PATH. && PAUSE && EXIT /B
echo Python must be 2.x.

echo Installing Jekyll
start /wait CMD /c "gem install jekyll"
echo Installing Bundler
start /wait CMD /c "gem install bundler"
echo Installing Npm client dependencies
start /wait CMD /c "npm install --global gulp-cli"
echo Installing Bundle dependencies
start /wait CMD /c "bundle install"
start /wait CMD /c "bundle update"
echo Installing Npm libraries. If the install fail you might need to update the library versions in 'package.json'.
start /wait CMD /c "npm install"
echo Starting site/service.
bundle exec gulp

