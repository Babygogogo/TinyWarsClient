
@echo off
@REM publishConfig用于选取PublishConfig.js中的发布配置
set /p publishConfig=PublishConfig:

del     "bin-release/web/twc"                                       /S /Q       1>nul
node    utils\publisher\index.js %publishConfig%
del     "../TinyWarsWebServer/build/client"                         /S /Q       1>nul
mkdir   "../TinyWarsWebServer/build/client"                                     1>nul
xcopy   "bin-release/web/twc" "../TinyWarsWebServer/build/client"   /E /Y /I    1>nul
