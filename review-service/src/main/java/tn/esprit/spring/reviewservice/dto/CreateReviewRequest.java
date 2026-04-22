package tn.esprit.spring.reviewservice.dto;

public record CreateReviewRequest(
        Long productId,
        Integer rating,
        String comment
) {}
