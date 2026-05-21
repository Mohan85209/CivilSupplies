package in.civilsupplies.api.quote;

import in.civilsupplies.api.common.BaseAuditable;
import jakarta.persistence.*;

@Entity
@Table(name = "quotes", indexes = {
        @Index(name = "idx_quotes_email", columnList = "email"),
        @Index(name = "idx_quotes_status", columnList = "status")
})
public class Quote extends BaseAuditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(nullable = false, length = 160)
    private String email;

    @Column(name = "project_details", columnDefinition = "TEXT")
    private String projectDetails;

    @Column(name = "site_location", length = 200)
    private String siteLocation;

    @Column(length = 120)
    private String timeline;

    @Column(name = "boq_filename", length = 255)
    private String boqFilename;

    @Column(name = "boq_file_url", length = 500)
    private String boqFileUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private QuoteStatus status = QuoteStatus.NEW;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getProjectDetails() { return projectDetails; }
    public void setProjectDetails(String projectDetails) { this.projectDetails = projectDetails; }
    public String getSiteLocation() { return siteLocation; }
    public void setSiteLocation(String siteLocation) { this.siteLocation = siteLocation; }
    public String getTimeline() { return timeline; }
    public void setTimeline(String timeline) { this.timeline = timeline; }
    public String getBoqFilename() { return boqFilename; }
    public void setBoqFilename(String boqFilename) { this.boqFilename = boqFilename; }
    public String getBoqFileUrl() { return boqFileUrl; }
    public void setBoqFileUrl(String boqFileUrl) { this.boqFileUrl = boqFileUrl; }
    public QuoteStatus getStatus() { return status; }
    public void setStatus(QuoteStatus status) { this.status = status; }
}
