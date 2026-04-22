package tn.esprit.spring.productservice.service;

import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import tn.esprit.spring.productservice.client.CategoryClient;
import tn.esprit.spring.productservice.client.UserClient;
import tn.esprit.spring.productservice.dto.CreateProductRequest;
import tn.esprit.spring.productservice.dto.ProductCategoryEventDTO;
import tn.esprit.spring.productservice.dto.ProductResponse;
import tn.esprit.spring.productservice.dto.UpdateProductRequest;
import tn.esprit.spring.productservice.entity.Product;
import tn.esprit.spring.productservice.messaging.ProductCategoryProducer;
import tn.esprit.spring.productservice.repository.ProductRepository;

import java.util.List;

@Service
public class ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository repository;
    private final UserClient userClient;
    private final CategoryClient categoryClient;
    private final ProductCategoryProducer productCategoryProducer;

    public ProductService(ProductRepository repository, UserClient userClient,
                          CategoryClient categoryClient, ProductCategoryProducer productCategoryProducer) {
        this.repository = repository;
        this.userClient = userClient;
        this.categoryClient = categoryClient;
        this.productCategoryProducer = productCategoryProducer;
    }

    public ProductResponse create(CreateProductRequest req) {
        // FIX 1: Only validate category when a real id is given (not null, not 0)
        if (req.categoryId() != null && req.categoryId() > 0) {
            validateCategory(req.categoryId());
        }

        // FIX 2: treat categoryId=0 as "no category" -> store null
        Long categoryId = (req.categoryId() != null && req.categoryId() > 0) ? req.categoryId() : null;

        Product product = Product.builder()
                .name(req.name())
                .description(req.description())
                .price(req.price())
                .stock(req.stock())
                .imageUrl(req.imageUrl())
                .userId(req.userId())
                .categoryId(categoryId)
                .build();

        Product saved = repository.save(product);

        // FIX 3: non-blocking RabbitMQ publish - broker failure must NOT cause 500
        if (saved.getCategoryId() != null) {
            try {
                productCategoryProducer.sendProductCategoryEvent(
                        new ProductCategoryEventDTO(saved.getId(), saved.getName(), saved.getCategoryId(), "ASSIGNED")
                );
            } catch (Exception e) {
                log.warn("RabbitMQ publish failed for product id={}: {}", saved.getId(), e.getMessage());
            }
        }

        return map(saved);
    }

    public List<ProductResponse> findAll() {
        return repository.findAll().stream().map(this::map).toList();
    }

    public List<ProductResponse> searchByName(String name) {
        if (name == null || name.isBlank()) return findAll();
        List<ProductResponse> products = repository.findByNameContainingIgnoreCase(name)
                .stream().map(this::map).toList();
        if (products.isEmpty()) throw new RuntimeException("No products found with name containing: " + name);
        return products;
    }

    public ProductResponse findById(Long id) {
        return map(getEntity(id));
    }

    public ProductResponse update(Long id, UpdateProductRequest req) {
        if (req.categoryId() != null && req.categoryId() > 0) {
            validateCategory(req.categoryId());
        }

        Long categoryId = (req.categoryId() != null && req.categoryId() > 0) ? req.categoryId() : null;

        Product product = getEntity(id);
        Long oldCategoryId = product.getCategoryId();

        product.setName(req.name());
        product.setDescription(req.description());
        product.setPrice(req.price());
        product.setStock(req.stock());
        product.setImageUrl(req.imageUrl());
        product.setUserId(req.userId());
        product.setCategoryId(categoryId);

        Product saved = repository.save(product);

        try {
            if (categoryId != null && !categoryId.equals(oldCategoryId)) {
                productCategoryProducer.sendProductCategoryEvent(
                        new ProductCategoryEventDTO(saved.getId(), saved.getName(), saved.getCategoryId(), "ASSIGNED")
                );
            } else if (categoryId == null && oldCategoryId != null) {
                productCategoryProducer.sendProductCategoryEvent(
                        new ProductCategoryEventDTO(saved.getId(), saved.getName(), oldCategoryId, "UNASSIGNED")
                );
            }
        } catch (Exception e) {
            log.warn("RabbitMQ publish failed for product id={}: {}", saved.getId(), e.getMessage());
        }

        return map(saved);
    }

    public void delete(Long id) {
        repository.delete(getEntity(id));
    }

    public List<ProductResponse> findByUserId(Long userId) {
        return repository.findByUserId(userId).stream().map(this::map).toList();
    }

    public List<ProductResponse> findByCategoryId(Long categoryId) {
        return repository.findByCategoryId(categoryId).stream().map(this::map).toList();
    }

    public void reduceStock(Long productId, Integer quantity) {
        Product product = getEntity(productId);
        if (quantity == null || quantity <= 0) throw new RuntimeException("Quantity must be greater than 0");
        if (product.getStock() < quantity) throw new RuntimeException("Not enough stock for product id: " + productId);
        product.setStock(product.getStock() - quantity);
        repository.save(product);
    }

    public Product getProductEntity(Long id) {
        return getEntity(id);
    }

    private Product getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
    }

    private void validateCategory(Long categoryId) {
        try {
            categoryClient.getCategoryById(categoryId);
        } catch (Exception e) {
            throw new RuntimeException("Category not found or category-service unavailable for id: " + categoryId);
        }
    }

    private ProductResponse map(Product p) {
        return new ProductResponse(
                p.getId(), p.getName(), p.getDescription(),
                p.getPrice(), p.getStock(), p.getImageUrl(),
                p.getUserId(), p.getCategoryId()
        );
    }
}