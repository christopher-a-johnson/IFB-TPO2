echo cd %1
cd %1
if %errorlevel% neq 0 exit /b %errorlevel%
echo ##########---------- build check: step 1 completed ----------##########

echo setting git url preferences
call git config --global url."https://".insteadOf "git://"

echo call npm install
call npm install
if %errorlevel% neq 0 exit /b %errorlevel%
echo ##########---------- build check: step 2 completed ----------##########

echo call npm run test-builder
call npm run test-builder
if %errorlevel% neq 0 exit /b %errorlevel%
echo ##########---------- build check: step 3 completed ----------##########

echo call npm run build-builder
call npm run build-builder
if %errorlevel% neq 0 exit /b %errorlevel%
echo ##########---------- build check: step 4 completed ----------##########

echo copy to network folder %2
call XCOPY builder_build %2\web\builder /s /e /y /r /i
if %errorlevel% neq 0 exit /b %errorlevel%
echo ##########---------- build check: step 5 completed ----------##########

echo call npm run test-ci
call npm run test-ci
if %errorlevel% neq 0 exit /b %errorlevel%
echo ##########---------- build check: step 6 completed ----------##########

echo call npm run build-prod-ci-pipeline
call npm run build-prod-ci-pipeline
if %errorlevel% neq 0 exit /b %errorlevel%
echo ##########---------- build check: step 7 completed ----------##########

echo copy to network folder %2
call XCOPY build %2\web\app /s /e /y /r /i
if %errorlevel% neq 0 exit /b %errorlevel%
echo ##########---------- build check: step 8 completed ----------##########

echo call npm run test-prod-ci
call npm run test-prod-ci
if %errorlevel% neq 0 exit /b %errorlevel%
echo ##########---------- build check: step 9 completed ----------##########

echo copy to network folder %2
call XCOPY build %2\web\dev /s /e /y /r /i
if %errorlevel% neq 0 exit /b %errorlevel%
echo ##########---------- build check: step 10 completed ----------##########

call XCOPY api %2\web\api /s /e /y /r /i
if %errorlevel% neq 0 exit /b %errorlevel%
echo ##########---------- build check: step 11 completed ----------##########

exit %errorlevel%
