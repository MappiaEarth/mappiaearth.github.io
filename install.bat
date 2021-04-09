@echo off

set npm_path=C:\Program Files\nodejs
set PATH=C:\Ruby27-x64\bin;%npm_path%;%PATH%


set gitpath=C:\Program Files\Git\cmd
set PATH=%gitpath%;%PATH%
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
echo Installing Npm libraries. If the install fail you might need to update the library versions in 'package.json'.
start /wait CMD /c "npm install"
echo Starting site/service.
bundle exec gulp

