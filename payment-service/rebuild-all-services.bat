@echo off
echo ========================================
echo REBUILDING ALL MICROSERVICES
echo ========================================

echo.
echo [1/7] Building User Service...
cd user-service\User
call mvnw clean package -DskipTests
cd ..\..

echo.
echo [2/7] Building Product Service...
cd product-service
call mvnw clean package -DskipTests
cd ..

echo.
echo [3/7] Building Category Service...
cd category-service
call mvnw clean package -DskipTests
cd ..

echo.
echo [4/7] Building Order Service...
cd order-service\Order
call mvnw clean package -DskipTests
cd ..\..

echo.
echo [5/7] Building Payment Service...
cd payment-service
call mvnw clean package -DskipTests
cd ..

echo.
echo [6/7] Building Review Service...
cd review-service
call mvnw clean package -DskipTests
cd ..

echo.
echo [7/7] Building API Gateway...
cd ApiGatewayDemo
call mvnw clean package -DskipTests
cd ..

echo.
echo ========================================
echo ALL SERVICES REBUILT SUCCESSFULLY!
echo ========================================
echo.
echo Now restart all your services!
pause
