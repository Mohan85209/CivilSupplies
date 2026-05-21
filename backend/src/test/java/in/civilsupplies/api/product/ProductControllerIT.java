package in.civilsupplies.api.product;

import in.civilsupplies.api.category.Category;
import in.civilsupplies.api.category.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ProductControllerIT {

    @Autowired MockMvc mvc;
    @Autowired CategoryRepository categoryRepo;
    @Autowired ProductRepository productRepo;

    @BeforeEach
    void seed() {
        var cement = new Category();
        cement.setName("Cement");
        cement.setSlug("cement");
        cement.setSortOrder(1);
        categoryRepo.save(cement);

        var p = new Product();
        p.setName("UltraTech OPC 53");
        p.setSlug("ultratech-opc-53");
        p.setCategory(cement);
        p.setBrand("UltraTech");
        p.setUnit("50 kg bag");
        p.setActive(true);
        productRepo.save(p);
    }

    @Test
    void list_returnsPaginatedProducts() throws Exception {
        mvc.perform(get("/api/products?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].slug").value("ultratech-opc-53"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    void list_filtersByCategory() throws Exception {
        mvc.perform(get("/api/products?category=cement"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1));
    }

    @Test
    void getBySlug_returnsProduct() throws Exception {
        mvc.perform(get("/api/products/ultratech-opc-53"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.brand").value("UltraTech"));
    }

    @Test
    void getBySlug_notFound_returns404() throws Exception {
        mvc.perform(get("/api/products/does-not-exist"))
                .andExpect(status().isNotFound());
    }
}
