# 🔗 API Endpoints Reference

All requests go through **API Gateway: http://localhost:8087**

## 🔐 Authentication

### Login (Keycloak)
```http
POST http://localhost:8080/realms/EcommerceRealm/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=password
&client_id=gateway
&client_secret=xLrWX0ulXElEl4UR9J5RMt5B21G4a2uz
&username=admin
&password=admin123
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 300
}
```

---

## 📦 Products Service

### Get All Products
```http
GET http://localhost:8087/product-service/products?page=0&size=20
Authorization: Bearer <token>
```

### Get Product by ID
```http
GET http://localhost:8087/product-service/products/{id}
Authorization: Bearer <token>
```

### Search Products
```http
GET http://localhost:8087/product-service/products/search?name=laptop&page=0&size=20
Authorization: Bearer <token>
```

### Get Products by Category
```http
GET http://localhost:8087/product-service/products/category/{categoryId}?page=0&size=20
Authorization: Bearer <token>
```

### Create Product (ADMIN only)
```http
POST http://localhost:8087/product-service/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "stock": 100,
  "categoryId": 1,
  "imageUrl": "https://example.com/image.jpg"
}
```

### Update Product (ADMIN only)
```http
PUT http://localhost:8087/product-service/products/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Product",
  "price": 89.99
}
```

### Delete Product (ADMIN only)
```http
DELETE http://localhost:8087/product-service/products/{id}
Authorization: Bearer <token>
```

---

## 🏷️ Category Service

### Get All Categories
```http
GET http://localhost:8087/category-service/categories
Authorization: Bearer <token>
```

### Get Category by ID
```http
GET http://localhost:8087/category-service/categories/{id}
Authorization: Bearer <token>
```

### Create Category (ADMIN only)
```http
POST http://localhost:8087/category-service/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices"
}
```

### Update Category (ADMIN only)
```http
PUT http://localhost:8087/category-service/categories/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Category"
}
```

### Delete Category (ADMIN only)
```http
DELETE http://localhost:8087/category-service/categories/{id}
Authorization: Bearer <token>
```

---

## 📝 Review Service

### Get Reviews by Product
```http
GET http://localhost:8087/review-service/reviews/product/{productId}
Authorization: Bearer <token>
```

### Create Review (USER role)
```http
POST http://localhost:8087/review-service/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "rating": 5,
  "comment": "Great product!"
}
```

### Update Review (USER role, own review)
```http
PUT http://localhost:8087/review-service/reviews/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated review"
}
```

### Delete Review (ADMIN only)
```http
DELETE http://localhost:8087/review-service/reviews/{id}
Authorization: Bearer <token>
```

---

## 🛒 Order Service

### Get All Orders
```http
GET http://localhost:8087/order-service/orders?page=0&size=10
Authorization: Bearer <token>
```

### Get Order by ID
```http
GET http://localhost:8087/order-service/orders/{id}
Authorization: Bearer <token>
```

### Create Order (USER role)
```http
POST http://localhost:8087/order-service/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 99.99
    }
  ],
  "totalAmount": 199.98,
  "shippingAddress": "123 Main St, City, Country"
}
```

### Confirm Order (ADMIN only)
```http
PUT http://localhost:8087/order-service/orders/{id}/confirm
Authorization: Bearer <token>
```

### Cancel Order (USER role, own order)
```http
PUT http://localhost:8087/order-service/orders/{id}/cancel
Authorization: Bearer <token>
```

### Delete Order (ADMIN only)
```http
DELETE http://localhost:8087/order-service/orders/{id}
Authorization: Bearer <token>
```

---

## 💳 Payment Service

### Get All Payments (ADMIN only)
```http
GET http://localhost:8087/payment-service/payments?page=0&size=10
Authorization: Bearer <token>
```

### Get Payment by ID
```http
GET http://localhost:8087/payment-service/payments/{id}
Authorization: Bearer <token>
```

### Process Payment (ADMIN only)
```http
POST http://localhost:8087/payment-service/payments/{id}/process
Authorization: Bearer <token>
```

### Retry Payment (ADMIN only)
```http
POST http://localhost:8087/payment-service/payments/{id}/retry
Authorization: Bearer <token>
```

### Refund Payment (ADMIN only)
```http
POST http://localhost:8087/payment-service/payments/{id}/refund
Authorization: Bearer <token>
```

---

## 👤 User Service

### Get All Users (ADMIN only)
```http
GET http://localhost:8087/user-service/users?page=0&size=10
Authorization: Bearer <token>
```

### Get User by ID
```http
GET http://localhost:8087/user-service/users/{id}
Authorization: Bearer <token>
```

### Create User (ADMIN only)
```http
POST http://localhost:8087/user-service/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Update User (ADMIN only)
```http
PUT http://localhost:8087/user-service/users/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newemail@example.com"
}
```

### Delete User (ADMIN only)
```http
DELETE http://localhost:8087/user-service/users/{id}
Authorization: Bearer <token>
```

---

## 🔑 Test Credentials

### Admin User
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** `ADMIN`
- **Can:** Create/update/delete products, categories, users; confirm orders; process/refund payments; delete reviews

### Regular User
- **Username:** `user`
- **Password:** `user123`
- **Role:** `USER`
- **Can:** Create reviews, create orders, cancel own orders, view products/categories

---

## 🎯 Role-Based Access Control

### ADMIN Role Can:
- ✅ All USER permissions
- ✅ Create/Update/Delete Products
- ✅ Create/Update/Delete Categories
- ✅ Create/Update/Delete Users
- ✅ Confirm Orders
- ✅ Delete Orders
- ✅ View All Payments
- ✅ Process Payments
- ✅ Refund Payments
- ✅ Delete Any Review

### USER Role Can:
- ✅ View Products
- ✅ View Categories
- ✅ View Reviews
- ✅ Create Reviews
- ✅ Update Own Reviews
- ✅ Create Orders
- ✅ Cancel Own Orders
- ✅ View Own Orders

### Public (No Auth):
- ❌ Nothing - all endpoints require authentication

---

## 🔧 Frontend Service Mapping

```typescript
// environment.ts
export const environment = {
  apiGateway: 'http://localhost:8087',
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'EcommerceRealm',
    clientId: 'gateway',
    clientSecret: 'xLrWX0ulXElEl4UR9J5RMt5B21G4a2uz',
    tokenEndpoint: 'http://localhost:8080/realms/EcommerceRealm/protocol/openid-connect/token'
  },
  services: {
    products: 'http://localhost:8087/product-service',
    categories: 'http://localhost:8087/category-service',
    orders: 'http://localhost:8087/order-service',
    users: 'http://localhost:8087/user-service',
    reviews: 'http://localhost:8087/review-service',
    payments: 'http://localhost:8087/payment-service'
  }
};
```

---

## 📊 Response Formats

### Paginated Response
```json
{
  "content": [...],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalElements": 100,
  "totalPages": 5,
  "last": false
}
```

### Error Response
```json
{
  "timestamp": "2024-01-20T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied",
  "path": "/product-service/products"
}
```

---

## 🚀 Quick Test with cURL

### Login
```bash
curl -X POST http://localhost:8080/realms/EcommerceRealm/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&client_id=gateway&client_secret=xLrWX0ulXElEl4UR9J5RMt5B21G4a2uz&username=admin&password=admin123"
```

### Get Products
```bash
curl -X GET http://localhost:8087/product-service/products \
  -H "Authorization: Bearer <your-token-here>"
```

### Create Order
```bash
curl -X POST http://localhost:8087/order-service/orders \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": 1, "quantity": 2, "price": 99.99}],
    "totalAmount": 199.98,
    "shippingAddress": "123 Main St"
  }'
```

---

## 💡 Tips

1. **Always include Authorization header** for all requests (except Keycloak login)
2. **Token expires in 5 minutes** - refresh or login again
3. **Check roles** before calling ADMIN-only endpoints
4. **Use API Gateway** (port 8087) - don't call services directly
5. **Check Network tab** in browser DevTools to debug API calls
