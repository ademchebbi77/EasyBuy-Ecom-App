package tn.esprit.spring.reviewservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import tn.esprit.spring.reviewservice.config.FeignConfig;
import tn.esprit.spring.reviewservice.dto.UserDto;

@FeignClient(name = "USER-SERVICE", configuration = FeignConfig.class)
public interface UserClient {

    @GetMapping("/api/users/{id}")
    UserDto getUserById(@PathVariable Long id);

    @GetMapping("/api/users/me")
    UserDto getCurrentUser(@RequestHeader("Authorization") String authorizationHeader);
}
