package in.civilsupplies.api.quote;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuoteRepository extends JpaRepository<Quote, Long> {
    Page<Quote> findByStatus(QuoteStatus status, Pageable pageable);
}
