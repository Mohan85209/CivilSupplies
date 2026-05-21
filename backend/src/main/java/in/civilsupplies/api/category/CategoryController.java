package in.civilsupplies.api.category;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository repo;

    public CategoryController(CategoryRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    @Cacheable("categories")
    public List<CategoryDto> list() {
        return repo.findAllByOrderBySortOrderAscNameAsc().stream()
                .map(CategoryDto::from)
                .toList();
    }
}
