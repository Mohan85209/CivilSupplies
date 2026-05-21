package in.civilsupplies.api.product;

import in.civilsupplies.api.common.PageResponse;
import in.civilsupplies.api.exception.ApiException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository repo;

    public ProductController(ProductRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public PageResponse<ProductDto> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        if (size > 100) size = 100;
        Sort s = parseSort(sort);
        var p = repo.search(category, q, PageRequest.of(page, size, s));
        return PageResponse.of(p, ProductDto::from);
    }

    @GetMapping("/{slug}")
    public ProductDto bySlug(@PathVariable String slug) {
        return repo.findBySlug(slug)
                .map(ProductDto::from)
                .orElseThrow(() -> ApiException.notFound("Product"));
    }

    private static Sort parseSort(String sort) {
        String[] parts = sort.split(",");
        String prop = parts[0];
        Sort.Direction dir = parts.length > 1 && parts[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        return Sort.by(dir, prop);
    }
}
