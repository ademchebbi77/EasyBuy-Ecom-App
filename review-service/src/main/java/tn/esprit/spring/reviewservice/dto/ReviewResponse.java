package tn.esprit.spring.reviewservice.dto;

import java.time.Instant;

public record ReviewResponse(
        Long id,
        Long userId,
        String username,
        Long productId,
        Integer rating,
        String comment,
        Instant createdAt
) {}
