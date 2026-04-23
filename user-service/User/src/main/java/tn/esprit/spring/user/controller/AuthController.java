package tn.esprit.spring.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    /**
     * Mock authentication endpoint for testing without Keycloak.
     * Returns a fake JWT-like token structure.
     */
    @PostMapping("/token")
    public ResponseEntity<?> login(@RequestParam("username") String username,
                                    @RequestParam("password") String password) {
        
        try {
            // Simple validation - accept any username/password for testing
            if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
            }

            // Determine role based on username
            String role = username.equalsIgnoreCase("admin") ? "ADMIN" : "USER";
            
            // Create a fake JWT payload (base64 encoded)
            Map<String, Object> payload = new HashMap<>();
            payload.put("sub", username);
            payload.put("preferred_username", username);
            payload.put("email", username + "@example.com");
            payload.put("name", username);
            payload.put("exp", System.currentTimeMillis() / 1000 + 3600); // 1 hour from now
            
            // Add roles in Keycloak format
            Map<String, Object> resourceAccess = new HashMap<>();
            Map<String, Object> gatewayAccess = new HashMap<>();
            gatewayAccess.put("roles", List.of(role));
            resourceAccess.put("gateway", gatewayAccess);
            payload.put("resource_access", resourceAccess);
            
            // Create fake JWT (header.payload.signature)
            String payloadJson = new com.fasterxml.jackson.databind.ObjectMapper()
                    .writeValueAsString(payload);
            String encodedPayload = Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(payloadJson.getBytes());
            
            String fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + encodedPayload + ".fake-signature";
            
            // Return OAuth2 token response format
            Map<String, Object> response = new HashMap<>();
            response.put("access_token", fakeToken);
            response.put("refresh_token", "fake-refresh-token");
            response.put("token_type", "Bearer");
            response.put("expires_in", 3600);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Authentication failed"));
        }
    }
}
