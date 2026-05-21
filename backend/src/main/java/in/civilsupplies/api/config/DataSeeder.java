package in.civilsupplies.api.config;

import in.civilsupplies.api.user.AdminUser;
import in.civilsupplies.api.user.AdminUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Ensures the default admin account password hash is correct, regardless of
 * the placeholder value in the V2 seed migration. Idempotent.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private static final String DEFAULT_EMAIL = "admin@civilsupplies.in";
    private static final String DEFAULT_PASSWORD = "ChangeMe123!";

    private final AdminUserRepository userRepo;
    private final PasswordEncoder encoder;

    public DataSeeder(AdminUserRepository userRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        var existing = userRepo.findByEmailIgnoreCase(DEFAULT_EMAIL);
        if (existing.isPresent()) {
            // Re-hash deterministic dev password so login works regardless of seed hash.
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
        log.info("Default admin user created: {} / {}", DEFAULT_EMAIL, DEFAULT_PASSWORD);
    }
}
