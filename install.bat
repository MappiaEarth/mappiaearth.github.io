@echo off

set PATH=C:\Ruby25-x64\bin;%PATH%

set gitpath=C:\Danilo\Programas\PortableGit\cmd
set PATH=%gitpath%;%PATH%
where /q git || ECHO The GIT is missing. Ensure it is installed and placed in your PATH. && PAUSE && EXIT /B
where /q ruby || ECHO Ruby is missing. Ensure it is installed and placed in your PATH. && PAUSE && EXIT /B
where /q py || ECHO Python is missing. Ensure it is installed and placed in your PATH. && PAUSE && EXIT /B
echo Python must be 2.x.

echo install NPM dependencies
npm install

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
rem echo Bundle Install requirements
rem bundle install
echo Starting site/service.
bundle exec gulp

