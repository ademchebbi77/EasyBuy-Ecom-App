package tn.esprit.spring.user.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/eureka/**", "/actuator/**").permitAll()
                        // Allow public access to GET /api/users/{id} for displaying usernames in reviews
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/users/*").permitAll()
                        // /me is accessible to any authenticated user (USER or ADMIN)
                        .requestMatchers("/api/users/me").authenticated()
                        // PUT /api/users/{id} — ownership check is done inside UserController
                        .requestMatchers("/api/users/**").authenticated()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwkSetUri("http://localhost:8080/realms/EcommerceRealm/protocol/openid-connect/certs")
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                        )
                );
        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(keycloakRolesConverter());
        return converter;
    }

    private Converter<Jwt, Collection<GrantedAuthority>> keycloakRolesConverter() {
        JwtGrantedAuthoritiesConverter defaultConverter = new JwtGrantedAuthoritiesConverter();
        return jwt -> {
            Collection<GrantedAuthority> authorities = defaultConverter.convert(jwt);
            if (authorities == null) authorities = Collections.emptyList();

            Map<String, Object> resourceAccess = jwt.getClaim("resource_access");
            if (resourceAccess == null) return authorities;

            // Extract roles from the "gateway" client
            Object gatewayObj = resourceAccess.get("gateway");
            if (!(gatewayObj instanceof Map)) return authorities;

            @SuppressWarnings("unchecked")
            Map<String, Object> gatewayAccess = (Map<String, Object>) gatewayObj;

            Object rolesObj = gatewayAccess.get("roles");
            if (!(rolesObj instanceof List)) return authorities;

            @SuppressWarnings("unchecked")
            List<String> roles = (List<String>) rolesObj;

            Collection<GrantedAuthority> clientRoles = roles.stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .collect(Collectors.toList());

            return Stream.concat(authorities.stream(), clientRoles.stream())
                    .collect(Collectors.toList());
        };
    }
}