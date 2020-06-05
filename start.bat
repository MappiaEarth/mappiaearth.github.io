@echo off

set npm_path=F:\Danilo\Programas\NodeJs\node-v10.16.2-win-x64\
set PATH=C:\Ruby25-x64\bin;%npm_path%;%PATH%


set gitpath=C:\Danilo\Programas\PortableGit\cmd
set PATH=%gitpath%;%PATH%

bundle exec gulp --watch
