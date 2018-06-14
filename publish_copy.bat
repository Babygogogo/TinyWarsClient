
call egret publish --version twc
call xcopy "bin-release/web/twc" "../TinyWarsServer/build" /E /Y /I
