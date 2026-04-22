package tn.esprit.spring.user.service;

import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KeycloakService {

    @Value("${keycloak.server-url:http://localhost:8080}")
    private String serverUrl;

    @Value("${keycloak.realm:EcommerceRealm}")
    private String realm;

    @Value("${keycloak.admin-username:admin}")
    private String adminUsername;

    @Value("${keycloak.admin-password:admin}")
    private String adminPassword;

    @Value("${keycloak.gateway-client-id:gateway}")
    private String gatewayClientId;

    private Keycloak buildKeycloak() {
        return KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm("master")
                .clientId("admin-cli")
                .username(adminUsername)
                .password(adminPassword)
                .build();
    }

    public void createUser(String username, String email, String password, String role) {
        Keycloak keycloak = buildKeycloak();
        try {
            // 1. Build user
            UserRepresentation user = new UserRepresentation();
            user.setUsername(username);
            user.setEmail(email);
            user.setFirstName(username); // required by realm profile
            user.setLastName("User");    // required by realm profile
            user.setEnabled(true);
            user.setEmailVerified(true);

            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(password);
            credential.setTemporary(false);
            user.setCredentials(List.of(credential));

            // 2. Create user
            Response response = keycloak.realm(realm).users().create(user);
            int status = response.getStatus();
            response.close();

            if (status != 201) {
                throw new RuntimeException("Failed to create user in Keycloak: HTTP " + status);
            }

            // 3. Get user ID from Keycloak
            List<UserRepresentation> users = keycloak.realm(realm).users()
                    .searchByUsername(username, true);
            if (users.isEmpty()) {
                throw new RuntimeException("User created but not found in Keycloak");
            }
            String userId = users.get(0).getId();

            // 4. Find gateway client
            List<ClientRepresentation> clients = keycloak.realm(realm).clients()
                    .findByClientId(gatewayClientId);
            if (clients == null || clients.isEmpty()) {
                System.err.println("Gateway client not found: " + gatewayClientId);
                return;
            }
            String clientUuid = clients.get(0).getId();

            // 5. Find role
            String roleName = (role == null || role.isBlank()) ? "USER" : role.toUpperCase();
            RoleRepresentation clientRole = keycloak.realm(realm)
                    .clients().get(clientUuid)
                    .roles().get(roleName).toRepresentation();

            // 6. Assign role
            keycloak.realm(realm).users().get(userId)
                    .roles().clientLevel(clientUuid)
                    .add(List.of(clientRole));

            System.out.println("✓ User " + username + " created in Keycloak with role " + roleName);

        } catch (Exception e) {
            System.err.println("✗ Keycloak error: " + e.getMessage());
            throw new RuntimeException("Keycloak user creation failed: " + e.getMessage());
        } finally {
            keycloak.close();
        }
    }

    public void deleteUser(String username) {
        Keycloak keycloak = buildKeycloak();
        try {
            List<UserRepresentation> users = keycloak.realm(realm).users()
                    .searchByUsername(username, true);
            if (!users.isEmpty()) {
                keycloak.realm(realm).users().delete(users.get(0).getId());
                System.out.println("✓ User " + username + " deleted from Keycloak");
            }
        } catch (Exception e) {
            System.err.println("✗ Could not delete user from Keycloak: " + e.getMessage());
        } finally {
            keycloak.close();
        }
    }

    public void updateUser(String oldUsername, String newUsername, String email, String password) {
        Keycloak keycloak = buildKeycloak();
        try {
            // Find user by old username
            List<UserRepresentation> users = keycloak.realm(realm).users()
                    .searchByUsername(oldUsername, true);
            if (users.isEmpty()) {
                System.err.println("✗ User not found in Keycloak: " + oldUsername);
                return;
            }

            UserRepresentation user = users.get(0);
            String userId = user.getId();

            // Update username if changed
            if (newUsername != null && !newUsername.equals(oldUsername)) {
                user.setUsername(newUsername);
                user.setFirstName(newUsername);
            }

            // Update email if provided
            if (email != null && !email.isBlank()) {
                user.setEmail(email);
            }

            // Update user representation
            keycloak.realm(realm).users().get(userId).update(user);

            // Update password if provided
            if (password != null && !password.isBlank()) {
                CredentialRepresentation credential = new CredentialRepresentation();
                credential.setType(CredentialRepresentation.PASSWORD);
                credential.setValue(password);
                credential.setTemporary(false);
                keycloak.realm(realm).users().get(userId).resetPassword(credential);
            }

            System.out.println("✓ User updated in Keycloak: " + newUsername);

        } catch (Exception e) {
            System.err.println("✗ Could not update user in Keycloak: " + e.getMessage());
            throw new RuntimeException("Keycloak user update failed: " + e.getMessage());
        } finally {
            keycloak.close();
        }
    }
}
