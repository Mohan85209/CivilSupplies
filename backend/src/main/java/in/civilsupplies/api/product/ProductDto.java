package in.civilsupplies.api.product;

import java.time.OffsetDateTime;

public record ProductDto(
        Long id,
        String name,
        String slug,
        Long categoryId,
        String categoryName,
        String brand,
        String unit,
        String description,
        String imageUrl,
        boolean isActive,
        Double rating,
        Integer reviewCount,
        OffsetDateTime createdAt
) {
    public static ProductDto from(Product p) {
        return new ProductDto(
                p.getId(),
                p.getName(),
                p.getSlug(),
                p.getCategory().getId(),
                p.getCategory().getName(),
                p.getBrand(),
                p.getUnit(),
                p.getDescription(),
                p.getImageUrl(),
                p.isActive(),
                p.getRating(),
                p.getReviewCount(),
                p.getCreatedAt()
        );
    }
}
