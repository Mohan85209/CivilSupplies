package in.civilsupplies.api.enquiry;

import in.civilsupplies.api.email.EmailService;
import in.civilsupplies.api.exception.ApiException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EnquiryService {

    private final EnquiryRepository repo;
    private final EmailService email;

    public EnquiryService(EnquiryRepository repo, EmailService email) {
        this.repo = repo;
        this.email = email;
    }

    @Transactional
    public Enquiry create(EnquiryDto.Create dto) {
        var e = new Enquiry();
        e.setName(dto.name().trim());
        e.setPhone(dto.phone().trim());
        e.setEmail(dto.email().trim().toLowerCase());
        e.setCity(dto.city());
        e.setProjectType(dto.projectType());
        e.setMaterials(dto.materials());
        e.setQuantity(dto.quantity());
        e.setMessage(dto.message());
        e.setStatus(EnquiryStatus.NEW);
        Enquiry saved = repo.save(e);

        email.sendAdminNotification(
                "New enquiry from " + saved.getName(),
                "Name: " + saved.getName() + "\n" +
                "Phone: " + saved.getPhone() + "\n" +
                "Email: " + saved.getEmail() + "\n" +
                "City: " + (saved.getCity() == null ? "—" : saved.getCity()) + "\n" +
                "Project type: " + (saved.getProjectType() == null ? "—" : saved.getProjectType()) + "\n" +
                "Quantity: " + (saved.getQuantity() == null ? "—" : saved.getQuantity()) + "\n\n" +
                "Message:\n" + (saved.getMessage() == null ? "—" : saved.getMessage())
        );
        return saved;
    }

    public Page<Enquiry> list(int page, int size, EnquiryStatus status) {
        var pageable = PageRequest.of(page, Math.min(size, 100), Sort.by(Sort.Direction.DESC, "createdAt"));
        return status == null ? repo.findAll(pageable) : repo.findByStatus(status, pageable);
    }

    @Transactional
    public Enquiry updateStatus(Long id, EnquiryStatus status) {
        var e = repo.findById(id).orElseThrow(() -> ApiException.notFound("Enquiry"));
        e.setStatus(status);
        return e;
    }
}
