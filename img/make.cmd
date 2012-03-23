@set name=%1
@set mask=%2
@if "%name%"=="" goto end
@if "%mask%"=="" set mask=%name%\%name%*.png
@montage %mask% -background "rgba(255,255,255,0)" -geometry +0+0 -tile x1 %name%.png
:end
@if exist %name%.png echo complete %name%.png