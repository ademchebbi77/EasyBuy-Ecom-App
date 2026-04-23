@echo off
echo Building all microservices...

echo Building Eureka Server...
cd ..\eurekaserverdemo
call mvnw.cmd clean package -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%

echo Building Config Server...
cd ..\config-server
call mvnw.cmd clean package -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%

echo Building API Gateway...
cd ..\ApiGatewayDemo
call mvnw.cmd clean package -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%

echo Building User Service...
cd ..\user-service\User
call mvnw.cmd clean package -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%

echo Building Product Service...
cd ..\..\product-service
call mvnw.cmd clean package -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%

echo Building Order Service...
cd ..\order-service\Order
call mvnw.cmd clean package -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%

echo Building Category Service...
cd ..\..\category-service
call mvnw.cmd clean package -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%

echo Building Review Service...
cd ..\review-service
call mvnw.cmd clean package -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%

echo Building Payment Service...
cd ..\payment-service
call mvnw.cmd clean package -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%

cd ..\Docker
echo All services built successfully!
