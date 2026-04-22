package tn.esprit.spring.reviewservice.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate template) {
                try {
                    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                    
                    if (authentication != null && authentication.isAuthenticated() 
                            && authentication.getPrincipal() instanceof Jwt) {
                        Jwt jwt = (Jwt) authentication.getPrincipal();
                        template.header("Authorization", "Bearer " + jwt.getTokenValue());
                    }
                } catch (Exception e) {
                    // No authentication available, continue without token
                }
            }
        };
    }
}
