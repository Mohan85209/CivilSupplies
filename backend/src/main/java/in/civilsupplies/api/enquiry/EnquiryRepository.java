package in.civilsupplies.api.enquiry;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    Page<Enquiry> findByStatus(EnquiryStatus status, Pageable pageable);
}
