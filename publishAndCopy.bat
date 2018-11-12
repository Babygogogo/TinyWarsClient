
call del   "bin-release/web/twc"                                        /S /Q
call egret publish --version twc
call del   "../TinyWarsWebServer/build/client"                          /S /Q
call mkdir "../TinyWarsWebServer/build/client"
call xcopy "bin-release/web/twc" "../TinyWarsWebServer/build/client"    /E /Y /I
