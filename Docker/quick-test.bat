@echo off
echo ========================================
echo Quick Health Check for All Services
echo ========================================
echo.

echo [1/8] Checking Eureka Server...
curl -s http://localhost:8762/actuator/health
echo.
echo.

echo [2/8] Checking Config Server...
curl -s http://localhost:8888/actuator/health
echo.
echo.

echo [3/8] Checking API Gateway...
curl -s http://localhost:8087/actuator/health
echo.
echo.

echo [4/8] Checking User Service...
curl -s http://localhost:8081/actuator/health
echo.
echo.

echo [5/8] Checking Order Service...
curl -s http://localhost:8082/actuator/health
echo.
echo.

echo [6/8] Checking Product Service...
curl -s http://localhost:8083/actuator/health
echo.
echo.

echo [7/8] Checking Category Service...
curl -s http://localhost:8084/actuator/health
echo.
echo.

echo [8/8] Checking Payment Service...
curl -s http://localhost:8086/actuator/health
echo.
echo.

echo ========================================
echo Opening Eureka Dashboard...
echo ========================================
start http://localhost:8762

echo.
echo All checks complete!
echo Check if all services show "UP" status
pause
