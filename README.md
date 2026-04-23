Inès
ines555
En ligne

Areej — 16/04/2026 12:37
{
  "productId": 1,
  "userId": 2,
  "rating": 4,
  "comment": "Updated review"
}
///////////////////////////
GET
http://localhost:8087/api/reviews
/////////////////////////
DELETE
http://localhost:8087/api/reviews/1
//////////////////////////////////
GET
http://localhost:8087/api/reviews/product/1
//////////////////////////////
POST
http://localhost:8087/api/reviews
{
  "userId": 1,
  "productId": 1,
  "comment": "Very good product!",
  "rating": "TWO"
}
Jochimaro — Hier à 21:03
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 22, 2026 at 10:02 PM

commande_db.sql
7 Ko
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 22, 2026 at 10:02 PM

easybuy_db.sql
4 Ko
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 22, 2026 at 10:03 PM

product_db.sql
5 Ko
tasmaa ?
Areej — Hier à 21:14
adem tasmaa fia ?
Jochimaro — Hier à 21:14
yes
tasmaa ?
{
  "id" : "0035c8da-5557-4deb-b8a5-c750a8b9f4fe",
  "realm" : "EcommerceRealm",
  "notBefore" : 0,
  "defaultSignatureAlgorithm" : "RS256",
  "revokeRefreshToken" : false,... (43Korestants)

EcommerceRealm-realm.json
93 Ko
C:\export
Jochimaro — Hier à 22:53
naamel cijara
Jochimaro — Hier à 23:19
https://github.com/ademchebbi77/EasyBuy-Ecom-App.git
GitHub
GitHub - ademchebbi77/EasyBuy-Ecom-App
Contribute to ademchebbi77/EasyBuy-Ecom-App development by creating an account on GitHub.
GitHub - ademchebbi77/EasyBuy-Ecom-App
Achref1920 — Hier à 23:47
# EasyBuy E-Commerce Platform

A modern, scalable microservices-based e-commerce platform built with Spring Boot and Spring Cloud.

## 📋 Table of Contents

README.md
21 Ko
Jochimaro — 00:41
kc.bat start-dev
netstat -ano | findstr :8080
Areej — 00:50
docker compose up --build
Jochimaro — 01:25
{
  "info": {
    "name": "EasyBuy Microservices",
    "description": "Complete API collection for EasyBuy E-commerce Platform",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },

EasyBuy-Postman-Collection.json
25 Ko
Jochimaro — 01:51
1342344204
Jochimaro — 02:29
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 22, 2026 at 10:02 PM

easybuy_db.sql
4 Ko
﻿
# EasyBuy E-Commerce Platform

A modern, scalable microservices-based e-commerce platform built with Spring Boot and Spring Cloud.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Services](#services)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

EasyBuy is a full-featured e-commerce application designed with microservices architecture principles. It provides a complete solution for online shopping including user management, product catalog, order processing, payment handling, and review systems.

### Key Features

- 🔐 Secure authentication and authorization with Keycloak OAuth2
- 🛍️ Product catalog with category management
- 📦 Order processing and tracking
- 💳 Payment processing with retry mechanisms
- ⭐ Product reviews and ratings
- 🔔 Event-driven architecture for real-time updates
- 📊 Centralized configuration management
- 🔍 Service discovery and load balancing
- 🚪 API Gateway for unified access

## 🏗️ Architecture

The application follows a microservices architecture pattern with the following components:

```
┌─────────────┐
│   Frontend  │
│ (Port 4200) │
└──────┬──────┘
       │
┌──────▼──────────────────────────────────────────┐
│          API Gateway (Port 8087)                 │
│  - OAuth2 Security                               │
│  - Request Routing                               │
│  - CORS Configuration                            │
└──────┬──────────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────────┐
│      Eureka Server (Port 8761)                   │
│      Service Discovery                           │
└──────┬──────────────────────────────────────────┘
       │
       ├─────────────┬─────────────┬──────────────┐
       │             │             │              │
┌──────▼──────┐ ┌───▼────┐ ┌─────▼─────┐ ┌──────▼──────┐
│User Service │ │Product │ │  Order    │ │  Payment    │
│             │ │Service │ │  Service  │ │  Service    │
└─────────────┘ └────────┘ └───────────┘ └─────────────┘
       │             │             │              │
┌──────▼──────┐ ┌───▼────┐        │              │
│Category     │ │Review  │        │              │
│Service      │ │Service │        │              │
└─────────────┘ └────────┘        │              │
                                   │              │
                    ┌──────────────▼──────────────▼─────┐
                    │      RabbitMQ Message Broker       │
                    │      Event-Driven Communication    │
                    └────────────────────────────────────┘
```

### Communication Patterns

- **Synchronous**: REST APIs via OpenFeign for direct service-to-service calls
- **Asynchronous**: RabbitMQ for event-driven messaging and loose coupling

## 🛠️ Technologies

### Backend
- **Java 17**
- **Spring Boot**
  - Most services: 3.4.2
  - Config Server: 3.4.4
  - Eureka Server: 4.0.3
- **Spring Cloud**
  - Most services: 2024.0.0
  - Config Server: 2024.0.1
  - Eureka Server: 2025.1.0
- **Spring Cloud Components**
  - Spring Cloud Gateway
  - Spring Cloud Config
  - Netflix Eureka
  - OpenFeign
- **Spring Security with OAuth2**
- **Spring Data JPA**
- **Spring AMQP (RabbitMQ)**

### Databases
- **MySQL** - User, Product, Order services
- **MongoDB Atlas** - Payment service (cloud-hosted)
- **H2** - Category service (file-based), Review service (in-memory)

### Security & Authentication
- **Keycloak 26.0.0** - OAuth2 Authorization Server
- **JWT** - Token-based authentication
- **Spring Security** - Resource server implementation

### Message Broker
- **RabbitMQ** - Asynchronous event processing

### Build Tool
- **Maven 3.8+**

### Additional Libraries
- **Lombok** - Reduce boilerplate code
- **Spring Boot Actuator** - Monitoring and management
- **Spring Validation** - Bean validation

## 🔧 Services

### Infrastructure Services

#### 1. Eureka Server (Port 8761)
Service discovery and registration server.

**Features:**
- Service registration
- Health monitoring
- Load balancing support

#### 2. Config Server (Port 8888)
Centralized configuration management.

**Features:**
- External configuration
- Environment-specific configs
- Dynamic refresh

#### 3. API Gateway (Port 8087)
Single entry point for all client requests.

**Features:**
- Request routing
- OAuth2 authentication
- CORS handling
- Load balancing

### Business Services

#### 4. User Service (Port 8081)
Manages user accounts and authentication with Keycloak integration.

**Endpoints:**
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

**Features:**
- Keycloak admin client integration
- User registration and management
- Role-based access control

**Database:** MySQL (easybuy_db)

#### 5. Product Service (Port 8083)
Product catalog and inventory management.

**Endpoints:**
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/images/{filename}` - Get product image (public access)

**Features:**
- Image upload (max 10MB, base64 encoding)
- Stock management
- Low stock alerts via RabbitMQ
- Category association

**Database:** MySQL (product_db)

#### 6. Category Service (Port 8084)
Product categorization with event-driven updates.

**Endpoints:**
- `GET /api/categories` - List all categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

**Features:**
- Category deletion events published to RabbitMQ
- Product category updates via messaging
- H2 console available at `/h2-console`

**Database:** H2 (file-based: ./data/categorydb)

#### 7. Order Service (Port 8082)
Order processing and management with Feign client integration.

**Endpoints:**
- `GET /api/orders` - List all orders
- `GET /api/orders/{id}` - Get order by ID
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}` - Update order status

**Features:**
- Order creation with automatic reference generation
- Status tracking (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- Stock validation via Product Service
- User validation via User Service
- Order events published to RabbitMQ

**Database:** MySQL (commande_db)

#### 8. Payment Service (Port 8086)
Payment processing with MongoDB Atlas.

**Endpoints:**
- `GET /api/payments/{id}` - Get payment by ID
- `POST /api/payments` - Process payment

**Features:**
- Payment processing with multiple methods
- Retry mechanism for failed payments
- Status tracking (PENDING, COMPLETED, FAILED, REFUNDED)
- Order validation via Order Service
- Payment events published to RabbitMQ

**Database:** MongoDB Atlas (cloud-hosted)

#### 9. Review Service (Port 8085)
Product reviews and ratings with Feign client integration.

**Endpoints:**
- `GET /api/reviews` - List reviews
- `GET /api/reviews/product/{productId}` - Get reviews by product
- `POST /api/reviews` - Create review
- `PUT /api/reviews/{id}` - Update review
- `DELETE /api/reviews/{id}` - Delete review

**Features:**
- Product validation via Product Service
- User validation via User Service
- Review events published to RabbitMQ
- H2 console available at `/h2-console`

**Database:** H2 (in-memory: reviewdb)

## 📦 Prerequisites

Before running the application, ensure you have the following installed:

- **Java 17** (required)
- **Maven 3.8+**
- **MySQL 8.0+** (for User, Product, Order services)
- **RabbitMQ 3.9+** (for event-driven messaging)
- **Keycloak 26.0+** (for OAuth2 authentication)
- **Git**

**Optional:**
- **MongoDB** (only if not using MongoDB Atlas for Payment Service)
- **Docker** (recommended for running RabbitMQ and Keycloak)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/EasyBuy-Ecom-App.git
cd EasyBuy-Ecom-App
```

### 2. Setup Databases

#### MySQL
Create databases for MySQL-based services:

```sql
CREATE DATABASE easybuy_db;    -- User Service
CREATE DATABASE product_db;     -- Product Service
CREATE DATABASE commande_db;    -- Order Service
```

Update the database password in config files if needed (default is empty).

#### MongoDB Atlas
The Payment Service uses MongoDB Atlas (cloud). The connection string is already configured in `config-server/src/main/resources/config/payment-service.properties`.

For local MongoDB (optional):
```bash
# Uncomment local MongoDB URI in payment-service.properties
# spring.data.mongodb.uri=mongodb://localhost:27017/payment_db
```

#### H2 Databases
Category and Review services use H2 (no setup required):
- Category Service: File-based at `./data/categorydb`
- Review Service: In-memory (data lost on restart)

### 3. Setup RabbitMQ

Install and start RabbitMQ:

```bash
# Using Docker
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# Access management console at http://localhost:15672
# Default credentials: guest/guest
```

### 4. Setup Keycloak

```bash
# Using Docker
docker run -d --name keycloak \
  -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:26.0.0 start-dev
```

#### Configure Keycloak:
1. Access Keycloak at http://localhost:8080
2. Login with admin/admin
3. Create realm: `EcommerceRealm`
4. Create client: `gateway`
   - Client Protocol: openid-connect
   - Access Type: confidential
   - Valid Redirect URIs: http://localhost:4200/*
   - Web Origins: http://localhost:4200
5. Create roles in the gateway client (e.g., USER, ADMIN)
6. Create users and assign roles

### 5. Start Services

Start services in the following order:

#### Step 1: Start Eureka Server
```bash
cd eurekaserverdemo
mvn spring-boot:run
```
Wait until Eureka is fully started (http://localhost:8761)

#### Step 2: Start Config Server
```bash
cd config-server
mvn spring-boot:run
```

#### Step 3: Start Business Services
```bash
# User Service
cd user-service/User
mvn spring-boot:run

# Product Service
cd product-service
mvn spring-boot:run

# Category Service
cd category-service
mvn spring-boot:run

# Order Service
cd order-service/Order
mvn spring-boot:run

# Payment Service
cd payment-service
mvn spring-boot:run

# Review Service
cd review-service
mvn spring-boot:run
```

#### Step 4: Start API Gateway
```bash
cd ApiGatewayDemo
mvn spring-boot:run
```

### 6. Verify Installation

- Eureka Dashboard: http://localhost:8761
- API Gateway: http://localhost:8087
- Keycloak: http://localhost:8080
- RabbitMQ Management: http://localhost:15672

## ⚙️ Configuration

### Application Properties

Each service has its own `application.properties` file located in `src/main/resources/`.

#### Common Configuration

```properties
# Service Discovery
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/

# Config Server
spring.config.import=optional:configserver:http://localhost:8888

# RabbitMQ
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest
```

#### Database Configuration

Database configurations are managed by the Config Server in `config-server/src/main/resources/config/`.

**MySQL Services** (User, Product, Order):
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/[database_name]?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
```

**MongoDB Atlas** (Payment Service):
```properties
# Cloud MongoDB (Active)
spring.data.mongodb.uri=mongodb+srv://[username]:[password]@[cluster].mongodb.net/payment_db

# Local MongoDB (Backup - uncomment to use)
# spring.data.mongodb.uri=mongodb://localhost:27017/payment_db
```

**H2 Databases** (Category, Review):
```properties
# Category Service - File-based
spring.datasource.url=jdbc:h2:file:./data/categorydb;AUTO_SERVER=TRUE
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Review Service - In-memory
spring.datasource.url=jdbc:h2:mem:reviewdb;DB_CLOSE_DELAY=-1
```

### Service Ports

| Service | Port |
|---------|------|
| Eureka Server | 8761 |
| API Gateway | 8087 |
| Config Server | 8888 |
| User Service | 8081 |
| Order Service | 8082 |
| Product Service | 8083 |
| Category Service | 8084 |
| Review Service | 8085 |
| Payment Service | 8086 |
| Keycloak | 8080 |
| RabbitMQ | 5672 (AMQP), 15672 (Management) |
| MySQL | 3306 |

### Environment Variables

You can override properties using environment variables:

```bash
export EUREKA_URI=http://localhost:8761/eureka/
export RABBITMQ_HOST=localhost
export MYSQL_HOST=localhost
export KEYCLOAK_URI=http://localhost:8080
export MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/payment_db
```

## 📚 API Documentation

### Authentication

All API requests (except public endpoints) require a valid JWT token.

#### Obtain Access Token

```bash
curl -X POST http://localhost:8080/realms/EcommerceRealm/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=gateway" \
  -d "username=your_username" \
  -d "password=your_password" \
  -d "grant_type=password"
```

#### Use Token in Requests

```bash
curl -X GET http://localhost:8087/product-service/api/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### API Endpoints

All requests go through the API Gateway at `http://localhost:8087`

#### User Service
- `GET /user-service/api/users/{id}`
- `POST /user-service/api/users`
- `PUT /user-service/api/users/{id}`
- `DELETE /user-service/api/users/{id}`

#### Product Service
- `GET /product-service/api/products`
- `GET /product-service/api/products/{id}`
- `POST /product-service/api/products`
- `PUT /product-service/api/products/{id}`
- `DELETE /product-service/api/products/{id}`

#### Order Service
- `GET /order-service/api/orders`
- `GET /order-service/api/orders/{id}`
- `POST /order-service/api/orders`

#### Payment Service
- `GET /payment-service/api/payments/{id}`
- `POST /payment-service/api/payments`

#### Category Service
- `GET /category-service/api/categories`
- `POST /category-service/api/categories`

#### Review Service
- `GET /review-service/api/reviews`
- `POST /review-service/api/reviews`

## 🔒 Security

### OAuth2 with Keycloak

The application uses Keycloak as the OAuth2 authorization server.

**Security Flow:**
1. Client authenticates with Keycloak
2. Keycloak issues JWT access token
3. Client includes token in Authorization header
4. API Gateway validates token
5. Gateway forwards request to appropriate service
6. Service validates token independently

### Role-Based Access Control

Roles are managed in Keycloak and mapped to Spring Security authorities:

- `ROLE_USER` - Regular user access
- `ROLE_ADMIN` - Administrative access

### CORS Configuration

CORS is configured at the API Gateway level to allow requests from:
- `http://localhost:4200` (Angular frontend)

## 🔄 Event-Driven Architecture

### RabbitMQ Queues

| Queue Name | Producer | Consumer | Purpose |
|------------|----------|----------|---------|
| `ORDER_QUEUE` | Order Service | Payment Service | Order creation events |
| `ORDER_STATUS_QUEUE` | Order Service | User Service | Order status updates |
| `PAYMENT_QUEUE` | Payment Service | Order Service | Payment status events |
| `PRODUCT_STOCK_QUEUE` | Order Service | Product Service | Stock updates |
| `LOW_STOCK_ALERT_QUEUE` | Product Service | User Service | Low stock alerts |
| `CATEGORY_DELETED_QUEUE` | Category Service | Product Service | Category deletion events |
| `REVIEW_CREATED_QUEUE` | Review Service | User Service | New review notifications |

## 🧪 Testing

### Run Unit Tests

```bash
# Test all services
mvn test

# Test specific service
cd user-service/User
mvn test
```

### Run Integration Tests

```bash
mvn verify
```

## 📊 Monitoring

### Actuator Endpoints

Each service exposes Spring Boot Actuator endpoints:

- `/actuator/health` - Health check
- `/actuator/info` - Service information
- `/actuator/metrics` - Metrics
- `/actuator/refresh` - Refresh configuration

Access via: `http://localhost:[service-port]/actuator/health`

## 🐛 Troubleshooting

### Common Issues

**Services not registering with Eureka:**
- Ensure Eureka Server is running
- Check `eureka.client.service-url.defaultZone` configuration
- Verify network connectivity

**Authentication failures:**
- Verify Keycloak is running
- Check realm and client configuration
- Ensure JWT issuer-uri is correct

**RabbitMQ connection errors:**
- Verify RabbitMQ is running
- Check credentials (default: guest/guest)
- Ensure port 5672 is accessible

**Database connection errors:**
- Verify MySQL is running (for User, Product, Order services)
- Check database credentials in config server properties
- Ensure databases are created (easybuy_db, product_db, commande_db)
- For Payment Service, verify MongoDB Atlas connection string
- H2 databases (Category, Review) don't require external setup

**Version compatibility issues:**
- Note: Eureka Server uses Spring Boot 4.0.3 while other services use 3.4.2
- This is intentional for compatibility with Spring Cloud 2025.1.0
- Ensure all services can communicate despite version differences

## 📝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow Java coding conventions
- Write unit tests for new features
- Update documentation as needed
- Use meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Erij Ben Salah** - *Developer*
- **Mohamed Adem Chebbi** - *Developer*
- **Achref Arfaoui** - *Developer*
- **Moemen Ouled Ali** - *Developer*
- **Ines Manai** - *Developer*

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Spring Cloud team for microservices components
- Netflix OSS for Eureka service discovery
- Keycloak team for the OAuth2 authentication solution
- RabbitMQ team for the message broker
- MongoDB Atlas for cloud database hosting

## 📞 Support

For support, email support@easybuy.com or open an issue in the repository.

---

Made with ❤️ by the EasyBuy Team
README.md
21 Ko