package tn.esprit.spring.reviewservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.time.Instant;
@Entity
public class Review {
    @Id
    private Long id;
    private Long userId;
    private Long productId;
    private Integer rating;
    private String comment;
    private Instant createdAt;

    public void setRating(Integer rating) {
    }

    public void setComment(String comment) {
    }

    public Long getUserId() {
        return userId;
    }

    public Long getProductId() {
        return productId;
    }

    public Integer getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Long getId() {
        return id;
    }

    // Constructor, Getters, Setters

    public static class Builder {
        private Long id;
        private Long userId;
        private Long productId;
        private Integer rating;
        private String comment;
        private Instant createdAt;

        public Builder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public Builder productId(Long productId) {
            this.productId = productId;
            return this;
        }

        public Builder rating(Integer rating) {
            this.rating = rating;
            return this;
        }

        public Builder comment(String comment) {
            this.comment = comment;
            return this;
        }

        public Builder createdAt(Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Review build() {
            Review review = new Review();
            review.userId = this.userId;
            review.productId = this.productId;
            review.rating = this.rating;
            review.comment = this.comment;
            review.createdAt = this.createdAt;
            return review;
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}