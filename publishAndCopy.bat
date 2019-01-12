
del     "bin-release/web/twc"                                       /S /Q       1>nul
node    utils\publisher\index.js
del     "../TinyWarsWebServer/build/client"                         /S /Q       1>nul
mkdir   "../TinyWarsWebServer/build/client"                                     1>nul
xcopy   "bin-release/web/twc" "../TinyWarsWebServer/build/client"   /E /Y /I    1>nul
