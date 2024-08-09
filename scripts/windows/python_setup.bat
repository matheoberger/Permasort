@echo off
setlocal

REM Check if the env folder exists
if not exist "env\Scripts\activate.bat" (
    echo Virtual environment not found. Please create it first.
    exit /b 1
)

REM Activate the virtual environment
call env\Scripts\activate.bat

REM Check for differences between installed packages and requirements
pip freeze > installed.txt
fc /N installed.txt requirements.txt > diff.txt

REM Check if there are differences
findstr /c:"*****" diff.txt >nul
if %errorlevel% equ 0 (
    echo All requirements are already satisfied.
    del installed.txt
    del diff.txt
    exit /b 0
) else (
    echo There are differences between installed packages and requirements:
    type diff.txt
    echo.
    set /p choice=Do you want to install the missing packages? (yes/no): 
    if /i "%choice%"=="yes" (
        pip install -r requirements.txt
    )
    del installed.txt
    del diff.txt
)

endlocal