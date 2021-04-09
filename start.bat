@echo off

set npm_path=C:\Program Files\nodejs
set PATH=C:\Ruby27-x64\bin;%npm_path%;%PATH%


set gitpath=C:\Program Files\Git\cmd
set PATH=%gitpath%;%PATH%

bundle exec gulp --watch --incremental
