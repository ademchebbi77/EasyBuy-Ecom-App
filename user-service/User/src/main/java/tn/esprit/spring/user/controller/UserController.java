package tn.esprit.spring.user.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import tn.esprit.spring.user.dto.CreateUserRequest;
import tn.esprit.spring.user.dto.OrderDto;
import tn.esprit.spring.user.dto.ProductDto;
import tn.esprit.spring.user.dto.UpdateUserRequest;
import tn.esprit.spring.user.dto.UserResponse;
import tn.esprit.spring.user.service.UserService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    // ADMIN only can create users via this endpoint
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest req) {
        UserResponse created = service.create(req);
        return ResponseEntity.created(URI.create("/api/users/" + created.id())).body(created);
    }

    /**
     * Returns the DB record for the currently authenticated user.
     * If the user doesn't exist, automatically creates them.
     *
     * Resolution order:
     *  1. Match by preferred_username claim (normal Keycloak login)
     *  2. Match by email claim
     *  3. Match by sub (Keycloak UUID stored as username during social login)
     *  4. If not found, auto-create the user
     *
     * Returns 404 instead of 500 when auto-creation fails.
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            return ResponseEntity.status(401).build();
        }

        UserResponse user = getCurrentUserFromJwt(jwt);
        
        if (user != null) {
            return ResponseEntity.ok(user);
        }

        // User not found - auto-create from JWT claims
        try {
            UserResponse newUser = service.createFromJwt(jwt);
            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            // Auto-creation failed
            return ResponseEntity.notFound().build();
        }
    }

    // ADMIN only can view all users
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> all(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean enabled) {
        return service.searchUsers(username, role, enabled);
    }

    // Anyone can view basic user info (username) - needed for displaying reviews publicly
    @GetMapping("/{id}")
    public UserResponse one(@PathVariable Long id) {
        return service.findById(id);
    }

    // USER can update their own profile, ADMIN can update any
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public UserResponse update(@PathVariable Long id,
                               @Valid @RequestBody UpdateUserRequest req,
                               Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            // Get current user's DB ID by calling /me logic
            Jwt jwt = (Jwt) authentication.getPrincipal();
            UserResponse currentUser = getCurrentUserFromJwt(jwt);
            
            if (currentUser == null || !currentUser.id().equals(id)) {
                throw new org.springframework.security.access.AccessDeniedException(
                        "You can only edit your own profile");
            }
        }
        return service.update(id, req);
    }
    
    /**
     * Helper to resolve the current user from JWT (same logic as /me endpoint)
     */
    private UserResponse getCurrentUserFromJwt(Jwt jwt) {
        String preferredUsername = jwt.getClaimAsString("preferred_username");
        String email = jwt.getClaimAsString("email");
        String sub = jwt.getClaimAsString("sub");

        List<UserResponse> allUsers = service.findAll();

        // 1. preferred_username match (case-insensitive)
        if (preferredUsername != null) {
            java.util.Optional<UserResponse> byUsername = allUsers.stream()
                    .filter(u -> u.username().equalsIgnoreCase(preferredUsername))
                    .findFirst();
            if (byUsername.isPresent()) return byUsername.get();
        }

        // 2. email match
        if (email != null) {
            java.util.Optional<UserResponse> byEmail = allUsers.stream()
                    .filter(u -> email.equalsIgnoreCase(u.email()))
                    .findFirst();
            if (byEmail.isPresent()) return byEmail.get();
        }

        // 3. sub match (social / federation)
        if (sub != null) {
            java.util.Optional<UserResponse> bySub = allUsers.stream()
                    .filter(u -> sub.equals(u.username()))
                    .findFirst();
            if (bySub.isPresent()) return bySub.get();
        }

        return null;
    }

    // ADMIN only can delete users
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ADMIN only can enable/disable users
    @PatchMapping("/{id}/enable")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse enable(@PathVariable Long id) {
        return service.setEnabled(id, true);
    }

    @PatchMapping("/{id}/disable")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse disable(@PathVariable Long id) {
        return service.setEnabled(id, false);
    }

    // BOTH can view user orders
    @GetMapping("/{id}/orders")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public List<OrderDto> getUserOrders(@PathVariable Long id) {
        return service.getUserOrders(id);
    }

    // BOTH can view user products
    @GetMapping("/{id}/products")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public List<ProductDto> getUserProducts(@PathVariable Long id) {
        return service.getUserProducts(id);
    }
}