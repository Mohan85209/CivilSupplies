package in.civilsupplies.api.enquiry;

import in.civilsupplies.api.email.EmailService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EnquiryServiceTest {

    @Mock EnquiryRepository repo;
    @Mock EmailService email;
    @InjectMocks EnquiryService service;

    @Test
    void createPersistsEnquiryAndNotifiesAdmin() {
        var dto = new EnquiryDto.Create(
                "Ravi Reddy", "9505056386", "Ravi@Example.COM",
                "Hyderabad", "Commercial", List.of("Cement", "TMT Steel"),
                "50 tons", "Need quote for slab"
        );
        when(repo.save(any(Enquiry.class))).thenAnswer(inv -> {
            Enquiry e = inv.getArgument(0);
            e.setId(101L);
            return e;
        });

        Enquiry saved = service.create(dto);

        assertThat(saved.getId()).isEqualTo(101L);
        assertThat(saved.getEmail()).isEqualTo("ravi@example.com");
        assertThat(saved.getStatus()).isEqualTo(EnquiryStatus.NEW);
        assertThat(saved.getMaterials()).containsExactly("Cement", "TMT Steel");

        verify(repo).save(any(Enquiry.class));
        verify(email).sendAdminNotification(any(String.class), any(String.class));
    }
}
