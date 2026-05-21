package in.civilsupplies.api.newsletter;

import in.civilsupplies.api.common.BaseAuditable;
import jakarta.persistence.*;

@Entity
@Table(name = "newsletter_subscribers", indexes = {
        @Index(name = "idx_newsletter_email", columnList = "email", unique = true)
})
public class NewsletterSubscriber extends BaseAuditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 160)
    private String email;

    @Column(nullable = false)
    private boolean active = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
