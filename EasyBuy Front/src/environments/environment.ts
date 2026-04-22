export const environment = {
  production: false,
  apiGateway: 'http://localhost:8087',
  
  // Keycloak OAuth 2.0 Configuration
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'EcommerceRealm',
    clientId: 'gateway',
    clientSecret: 'xLrWX0ulXElEl4UR9J5RMt5B21G4a2uz',
    tokenEndpoint: 'http://localhost:8080/realms/EcommerceRealm/protocol/openid-connect/token'
  },
  
  // All services accessed through API Gateway
  services: {
    products: 'http://localhost:8087/product-service',
    categories: 'http://localhost:8087/category-service',
    orders: 'http://localhost:8087/order-service',
    users: 'http://localhost:8087/user-service',
    reviews: 'http://localhost:8087/review-service',
    payments: 'http://localhost:8087/payment-service'
  }
};
