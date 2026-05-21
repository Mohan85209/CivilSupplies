package in.civilsupplies.api.enquiry;

import in.civilsupplies.api.config.AppProperties;
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
    private final AppProperties props;

    public EnquiryService(EnquiryRepository repo, EmailService email, AppProperties props) {
        this.repo = repo;
        this.email = email;
        this.props = props;
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

        notifyAdmin(saved);
        sendCustomerAck(saved);
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

    private void notifyAdmin(Enquiry saved) {
        String body =
                "A new enquiry has been received.\n\n" +
                "Name:         " + saved.getName() + "\n" +
                "Phone:        " + saved.getPhone() + "\n" +
                "Email:        " + saved.getEmail() + "\n" +
                "City:         " + nullSafe(saved.getCity()) + "\n" +
                "Project type: " + nullSafe(saved.getProjectType()) + "\n" +
                "Materials:    " + (saved.getMaterials() == null ? "—" : String.join(", ", saved.getMaterials())) + "\n" +
                "Quantity:     " + nullSafe(saved.getQuantity()) + "\n\n" +
                "Message:\n" + nullSafe(saved.getMessage()) + "\n\n" +
                "— Civil Supplies | " + props.notification().contactPhone();
        email.sendAdminNotification("New enquiry from " + saved.getName(), body);
    }

    private void sendCustomerAck(Enquiry saved) {
        String body =
                "Hi " + saved.getName() + ",\n\n" +
                "Thanks for reaching out to Civil Supplies. We've received your enquiry and one of\n" +
                "our team will reply within one business day.\n\n" +
                "If it's urgent, please call or WhatsApp us at " + props.notification().contactPhone() + ".\n\n" +
                "Summary of your enquiry:\n" +
                "  City:         " + nullSafe(saved.getCity()) + "\n" +
                "  Project type: " + nullSafe(saved.getProjectType()) + "\n" +
                "  Quantity:     " + nullSafe(saved.getQuantity()) + "\n\n" +
                "— Civil Supplies, Hyderabad";
        email.sendCustomer(saved.getEmail(), "We've received your enquiry — Civil Supplies", body);
    }

    private static String nullSafe(String s) { return (s == null || s.isBlank()) ? "—" : s; }
}
