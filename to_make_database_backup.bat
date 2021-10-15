@REM not depend on windows location setting
@REM get date value 'yyyymmdd' format
for /f %%a in ('wmic os get LocalDateTime ^| findstr \.') DO set LDT=%%a
set CUR_DATE=%LDT:~0,8%
\xampp\mysql\bin\mysqldump.exe -u root --all-databases > "%HOMEPATH%\%CUR_DATE%.sql"
powershell compress-archive '%HOMEPATH%\%CUR_DATE%.sql' '%HOMEPATH%\%CUR_DATE%.zip'
