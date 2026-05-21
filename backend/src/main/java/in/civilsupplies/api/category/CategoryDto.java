package in.civilsupplies.api.category;

public record CategoryDto(Long id, String name, String slug, String imageUrl, Integer sortOrder) {
    public static CategoryDto from(Category c) {
        return new CategoryDto(c.getId(), c.getName(), c.getSlug(), c.getImageUrl(), c.getSortOrder());
    }
}
