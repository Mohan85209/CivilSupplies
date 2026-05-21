package in.civilsupplies.api.newsletter;

import in.civilsupplies.api.common.RateLimiter;
import in.civilsupplies.api.config.AppProperties;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {

    private final NewsletterRepository repo;
    private final RateLimiter rateLimiter;
    private final AppProperties props;

    public NewsletterController(NewsletterRepository repo, RateLimiter rateLimiter, AppProperties props) {
        this.repo = repo;
        this.rateLimiter = rateLimiter;
        this.props = props;
    }

    public record SubscribeRequest(@NotBlank @Email String email) {}

    @PostMapping("/subscribe")
    @Transactional
    public Map<String, Boolean> subscribe(@Valid @RequestBody SubscribeRequest req, HttpServletRequest httpReq) {
        rateLimiter.enforce(httpReq, "newsletter", props.ratelimit().newsletterPerHour());
        String email = req.email().trim().toLowerCase();
        var existing = repo.findByEmailIgnoreCase(email);
        if (existing.isEmpty()) {
            var sub = new NewsletterSubscriber();
            sub.setEmail(email);
            sub.setActive(true);
            repo.save(sub);
        } else if (!existing.get().isActive()) {
            existing.get().setActive(true);
        }
        return Map.of("ok", true);
    }
}
