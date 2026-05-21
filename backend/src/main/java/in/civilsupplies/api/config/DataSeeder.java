package in.civilsupplies.api.config;

import in.civilsupplies.api.category.Category;
import in.civilsupplies.api.category.CategoryRepository;
import in.civilsupplies.api.product.Product;
import in.civilsupplies.api.product.ProductRepository;
import in.civilsupplies.api.user.AdminUser;
import in.civilsupplies.api.user.AdminUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private static final String DEFAULT_EMAIL = "admin@civilsupplies.in";
    private static final String DEFAULT_PASSWORD = "ChangeMe123!";

    private final AdminUserRepository userRepo;
    private final CategoryRepository categoryRepo;
    private final ProductRepository productRepo;
    private final PasswordEncoder encoder;

    public DataSeeder(AdminUserRepository userRepo, CategoryRepository categoryRepo,
                      ProductRepository productRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.categoryRepo = categoryRepo;
        this.productRepo = productRepo;
        this.encoder = encoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedAdmin();
        seedCatalog();
    }

    private void seedAdmin() {
        var existing = userRepo.findByEmailIgnoreCase(DEFAULT_EMAIL);
        if (existing.isPresent()) {
            var user = existing.get();
            if (!encoder.matches(DEFAULT_PASSWORD, user.getPasswordHash())) {
                user.setPasswordHash(encoder.encode(DEFAULT_PASSWORD));
                userRepo.save(user);
                log.info("Default admin password hash refreshed for {}", DEFAULT_EMAIL);
            }
            return;
        }
        var u = new AdminUser();
        u.setEmail(DEFAULT_EMAIL);
        u.setPasswordHash(encoder.encode(DEFAULT_PASSWORD));
        u.setFullName("Default Admin");
        u.setActive(true);
        u.setRoles(Set.of("ROLE_ADMIN"));
        userRepo.save(u);
        log.info("Default admin user created: {} (dev password seeded — see README, rotate before prod)", DEFAULT_EMAIL);
    }

    private void seedCatalog() {
        if (categoryRepo.count() > 0) return;

        log.info("Seeding categories and products...");

        var cement = saveCategory("Cement", "cement", 1);
        var tmt = saveCategory("TMT Steel", "tmt-steel", 2);
        var bricks = saveCategory("Bricks & Blocks", "bricks-blocks", 3);
        var aggregates = saveCategory("Aggregates", "aggregates", 4);
        var rmc = saveCategory("Ready-Mix Concrete", "rmc", 5);
        var chemicals = saveCategory("Construction Chemicals", "chemicals", 6);
        var tools = saveCategory("Tools & Equipment", "tools", 7);
        var safety = saveCategory("Safety Gear", "safety", 8);

        productRepo.saveAll(List.of(
                product("UltraTech OPC 53 Grade", "ultratech-opc-53", cement, "UltraTech", "50 kg bag",
                        "High-strength Portland cement suitable for RCC structures, beams, and columns.", 4.7, 124),
                product("ACC PPC Cement", "acc-ppc", cement, "ACC", "50 kg bag",
                        "Portland Pozzolana Cement — durable, eco-friendlier blend for general construction.", 4.5, 88),
                product("Tata Tiscon TMT 12mm Fe-550D", "tata-tiscon-12mm", tmt, "Tata Tiscon", "Tonne",
                        "High-strength corrosion-resistant TMT bars, ideal for high-rise residential construction.", 4.8, 156),
                product("JSW Neosteel TMT 16mm", "jsw-neosteel-16mm", tmt, "JSW", "Tonne",
                        "JSW Neosteel premium TMT bars for heavy-load infrastructure projects.", 4.6, 92),
                product("Fly Ash Bricks (Class A)", "fly-ash-bricks", bricks, null, "1000 nos",
                        "Standard-size 9\"x4\"x3\" fly-ash bricks. Light, dimensionally accurate, low water absorption.", 4.4, 64),
                product("AAC Blocks 600x200x200", "aac-blocks-200", bricks, "Birla Aerocon", "Cubic metre",
                        "Autoclaved aerated concrete blocks - lightweight, thermal insulation, faster masonry.", 4.5, 41),
                product("M-Sand (Manufactured Sand)", "m-sand", aggregates, null, "Cubic metre",
                        "Crushed-stone fine aggregate ideal for plastering and concreting.", 4.3, 38),
                product("20mm Aggregate", "aggregate-20mm", aggregates, null, "Cubic metre",
                        "Coarse crushed stone aggregate (20 mm) for concrete mix.", 4.4, 27),
                product("M25 Grade RMC", "rmc-m25", rmc, null, "Cubic metre",
                        "Ready-mix concrete grade M25 - supplied site-fresh with delivery and pumping.", 4.6, 71),
                product("M30 Grade RMC", "rmc-m30", rmc, null, "Cubic metre",
                        "Ready-mix concrete grade M30 for heavily loaded structural elements.", 4.6, 55),
                product("Dr. Fixit Waterproofing", "dr-fixit-waterproofing", chemicals, "Dr. Fixit", "20 kg pack",
                        "Polymer-modified waterproofing for terraces, balconies, and wet areas.", 4.5, 33),
                product("Fosroc Construction Chemicals", "fosroc-admixture", chemicals, "Fosroc", "20 L can",
                        "Concrete admixture for workability and durability in critical pours.", 4.4, 24),
                product("Concrete Mixer 10/7", "concrete-mixer-10-7", tools, null, "Per day rental",
                        "Site mixer (10/7) for small-scale concrete preparation. Includes operator.", 4.3, 18),
                product("Surveying Total Station", "total-station", tools, "Leica", "Per day rental",
                        "Precision total station rental with operator for site surveying.", 4.7, 22),
                product("Safety Helmet (ISI)", "safety-helmet", safety, "Karam", "Piece",
                        "ISI-certified industrial safety helmets - bulk pricing available.", 4.5, 49)
        ));
        log.info("Seeded {} categories and {} products", categoryRepo.count(), productRepo.count());
    }

    private Category saveCategory(String name, String slug, int sortOrder) {
        var c = new Category();
        c.setName(name);
        c.setSlug(slug);
        c.setSortOrder(sortOrder);
        return categoryRepo.save(c);
    }

    private Product product(String name, String slug, Category category, String brand, String unit,
                            String description, double rating, int reviewCount) {
        var p = new Product();
        p.setName(name);
        p.setSlug(slug);
        p.setCategory(category);
        p.setBrand(brand);
        p.setUnit(unit);
        p.setDescription(description);
        p.setActive(true);
        p.setRating(rating);
        p.setReviewCount(reviewCount);
        return p;
    }
}
