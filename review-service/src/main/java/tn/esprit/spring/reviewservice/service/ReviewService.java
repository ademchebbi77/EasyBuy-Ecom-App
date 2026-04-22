package tn.esprit.spring.reviewservice.service;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import tn.esprit.spring.reviewservice.client.ProductClient;
import tn.esprit.spring.reviewservice.client.UserClient;
import tn.esprit.spring.reviewservice.dto.*;
import tn.esprit.spring.reviewservice.entity.Review;
import tn.esprit.spring.reviewservice.messaging.ReviewCreatedProducer;
import tn.esprit.spring.reviewservice.repository.ReviewRepository;

import java.time.Instant;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository repository;
    private final UserClient userClient;
    private final ProductClient productClient;
    private final ReviewCreatedProducer reviewCreatedProducer;

    public ReviewService(ReviewRepository repository, UserClient userClient,
                         ProductClient productClient, ReviewCreatedProducer reviewCreatedProducer) {
        this.repository = repository;
        this.userClient = userClient;
        this.productClient = productClient;
        this.reviewCreatedProducer = reviewCreatedProducer;
    }

    public ReviewResponse create(CreateReviewRequest req, Jwt jwt) {
        // Get current user from user service using JWT token
        String authHeader = "Bearer " + jwt.getTokenValue();
        UserDto currentUser;
        
        try {
            currentUser = userClient.getCurrentUser(authHeader);
        } catch (Exception e) {
            throw new RuntimeException("Your user account is not registered in the system. Please contact an administrator to create your account first. Error: " + e.getMessage());
        }
        
        if (!currentUser.enabled()) {
            throw new RuntimeException("User account is disabled");
        }
        
        Long userId = currentUser.id();
        
        if (req.rating() == null || req.rating() < 1 || req.rating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        Review review = Review.builder()
                .userId(userId)
                .productId(req.productId())
                .rating(req.rating())
                .comment(req.comment())
                .createdAt(Instant.now())
                .build();

        Review saved = repository.save(review);

        // Try to get product info for the event, but don't fail if unavailable
        try {
            ProductDto product = productClient.getProductById(req.productId());
            reviewCreatedProducer.sendReviewCreatedEvent(new ReviewCreatedEventDTO(
                    saved.getId(),
                    userId,
                    "user",
                    product.id(),
                    product.name(),
                    saved.getRating(),
                    saved.getComment()
            ));
        } catch (Exception e) {
            // Product service unavailable, send event with minimal info
            reviewCreatedProducer.sendReviewCreatedEvent(new ReviewCreatedEventDTO(
                    saved.getId(),
                    userId,
                    "user",
                    req.productId(),
                    "Product #" + req.productId(),
                    saved.getRating(),
                    saved.getComment()
            ));
        }

        return map(saved);
    }

    public List<ReviewResponse> findAll() {
        return repository.findAll().stream().map(this::map).toList();
    }

    public ReviewResponse findById(Long id) {
        return map(getEntity(id));
    }

    public List<ReviewResponse> findByProductId(Long productId) {
        // Don't verify product exists when just fetching reviews
        // This allows reviews to be displayed even if product service is temporarily unavailable
        return repository.findByProductId(productId)
                .stream().map(this::map).toList();
    }

    public List<ReviewResponse> findByUserId(Long userId) {
        return repository.findByUserId(userId)
                .stream().map(this::map).toList();
    }

    public ReviewResponse update(Long id, UpdateReviewRequest req) {
        Review review = getEntity(id);

        if (req.rating() != null) {
            if (req.rating() < 1 || req.rating() > 5) {
                throw new RuntimeException("Rating must be between 1 and 5");
            }
            review.setRating(req.rating());
        }

        if (req.comment() != null) {
            review.setComment(req.comment());
        }

        return map(repository.save(review));
    }

    public void delete(Long id) {
        getEntity(id);
        repository.deleteById(id);
    }

    private Review getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));
    }

    private UserDto getUserOrThrow(Long userId) {
        try {
            UserDto user = userClient.getUserById(userId);
            if (!user.enabled()) {
                throw new RuntimeException("User is disabled with id: " + userId);
            }
            return user;
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("User not found with id: " + userId);
        }
    }

    private ProductDto getProductOrThrow(Long productId) {
        try {
            return productClient.getProductById(productId);
        } catch (Exception e) {
            throw new RuntimeException("Product not found with id: " + productId);
        }
    }

    private ReviewResponse map(Review r) {
        // Try to fetch user information, but don't fail if unavailable
        String username = "User #" + r.getUserId();
        
        try {
            UserDto user = userClient.getUserById(r.getUserId());
            username = user.username();
        } catch (Exception e) {
            // User service unavailable or user not found - use fallback username
            // This is expected for unauthenticated requests
        }
        
        return new ReviewResponse(
                r.getId(),
                r.getUserId(),
                username,
                r.getProductId(),
                r.getRating(),
                r.getComment(),
                r.getCreatedAt()
        );
    }
}
