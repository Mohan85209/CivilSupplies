package in.civilsupplies.api.quote;

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

    public QuoteService(QuoteRepository repo, StorageService storage, EmailService email) {
        this.repo = repo;
        this.storage = storage;
        this.email = email;
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

        email.sendAdminNotification(
                "New quote request from " + saved.getName(),
                "Name: " + saved.getName() + "\n" +
                "Phone: " + saved.getPhone() + "\n" +
                "Email: " + saved.getEmail() + "\n" +
                "Site: " + (saved.getSiteLocation() == null ? "—" : saved.getSiteLocation()) + "\n" +
                "Timeline: " + (saved.getTimeline() == null ? "—" : saved.getTimeline()) + "\n" +
                "BOQ: " + (saved.getBoqFilename() == null ? "not attached" : saved.getBoqFilename()) + "\n\n" +
                "Details:\n" + (saved.getProjectDetails() == null ? "—" : saved.getProjectDetails())
        );
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
}
