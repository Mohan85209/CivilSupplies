package in.civilsupplies.api.quote;

import in.civilsupplies.api.config.AppProperties;
import in.civilsupplies.api.email.EmailService;
import in.civilsupplies.api.exception.ApiException;
import in.civilsupplies.api.storage.StorageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class QuoteService {

    private final QuoteRepository repo;
    private final StorageService storage;
    private final EmailService email;
    private final AppProperties props;

    public QuoteService(QuoteRepository repo, StorageService storage, EmailService email, AppProperties props) {
        this.repo = repo;
        this.storage = storage;
        this.email = email;
        this.props = props;
    }

    @Transactional
    public Quote create(QuoteDto.Create dto, MultipartFile boq) {
        var q = new Quote();
        q.setName(dto.name().trim());
        q.setPhone(dto.phone().trim());
        q.setEmail(dto.email().trim().toLowerCase());
        q.setProjectDetails(dto.projectDetails());
        q.setSiteLocation(dto.siteLocation());
        q.setTimeline(dto.timeline());
        q.setStatus(QuoteStatus.NEW);

        if (boq != null && !boq.isEmpty()) {
            var stored = storage.store(boq, "boq");
            q.setBoqFilename(stored.filename());
            q.setBoqFileUrl(stored.url());
        }

        Quote saved = repo.save(q);

        notifyAdmin(saved);
        sendCustomerAck(saved);
        return saved;
    }

    public Page<Quote> list(int page, int size, QuoteStatus status) {
        var pageable = PageRequest.of(page, Math.min(size, 100), Sort.by(Sort.Direction.DESC, "createdAt"));
        return status == null ? repo.findAll(pageable) : repo.findByStatus(status, pageable);
    }

    @Transactional
    public Quote updateStatus(Long id, QuoteStatus status) {
        var q = repo.findById(id).orElseThrow(() -> ApiException.notFound("Quote"));
        q.setStatus(status);
        return q;
    }

    public Quote get(Long id) {
        return repo.findById(id).orElseThrow(() -> ApiException.notFound("Quote"));
    }

    private void notifyAdmin(Quote saved) {
        String body =
                "A new quote request (RFQ) has been submitted.\n\n" +
                "Name:     " + saved.getName() + "\n" +
                "Phone:    " + saved.getPhone() + "\n" +
                "Email:    " + saved.getEmail() + "\n" +
                "Site:     " + nullSafe(saved.getSiteLocation()) + "\n" +
                "Timeline: " + nullSafe(saved.getTimeline()) + "\n" +
                "BOQ:      " + (saved.getBoqFilename() == null ? "not attached" : saved.getBoqFilename()) + "\n\n" +
                "Project details:\n" + nullSafe(saved.getProjectDetails()) + "\n\n" +
                "— Civil Supplies | " + props.notification().contactPhone();
        email.sendAdminNotification("New quote request from " + saved.getName(), body);
    }

    private void sendCustomerAck(Quote saved) {
        String body =
                "Hi " + saved.getName() + ",\n\n" +
                "Thanks for sending us your project details. We've received your BOQ" +
                (saved.getBoqFilename() != null ? " (" + saved.getBoqFilename() + ")" : "") +
                " and our team will revert with a consolidated, project-rate quote within 24 hours.\n\n" +
                "Need to talk it through? Call or WhatsApp us at " + props.notification().contactPhone() + ".\n\n" +
                "— Civil Supplies, Hyderabad";
        email.sendCustomer(saved.getEmail(), "We've received your BOQ — Civil Supplies", body);
    }

    private static String nullSafe(String s) { return (s == null || s.isBlank()) ? "—" : s; }
}
