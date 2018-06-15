
call rd /s /q "bin-release/web/twc"
call egret publish --version twc
call xcopy "bin-release/web/twc" "../TinyWarsServer/build/client" /E /Y /I
