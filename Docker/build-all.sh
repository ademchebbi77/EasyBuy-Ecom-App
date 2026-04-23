#!/bin/bash

echo "Building all microservices..."

# Build Eureka Server
echo "Building Eureka Server..."
cd ../eurekaserverdemo && ./mvnw clean package -DskipTests

# Build Config Server
echo "Building Config Server..."
cd ../config-server && ./mvnw clean package -DskipTests

# Build API Gateway
echo "Building API Gateway..."
cd ../ApiGatewayDemo && ./mvnw clean package -DskipTests

# Build User Service
echo "Building User Service..."
cd ../user-service/User && ./mvnw clean package -DskipTests

# Build Product Service
echo "Building Product Service..."
cd ../product-service && ./mvnw clean package -DskipTests

# Build Order Service
echo "Building Order Service..."
cd ../order-service/Order && ./mvnw clean package -DskipTests

# Build Category Service
echo "Building Category Service..."
cd ../category-service && ./mvnw clean package -DskipTests

# Build Review Service
echo "Building Review Service..."
cd ../review-service && ./mvnw clean package -DskipTests

# Build Payment Service
echo "Building Payment Service..."
cd ../payment-service && ./mvnw clean package -DskipTests

echo "All services built successfully!"
