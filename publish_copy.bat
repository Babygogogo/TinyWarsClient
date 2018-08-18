
call rd /s /q "bin-release/web/twc"
call egret publish --version twc
call del   "../TinyWarsServer/build/client"                         /S /Q
call mkdir "../TinyWarsServer/build/client"
call xcopy "bin-release/web/twc" "../TinyWarsServer/build/client"   /E /Y /I
