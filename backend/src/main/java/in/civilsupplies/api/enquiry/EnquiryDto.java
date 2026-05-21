package in.civilsupplies.api.enquiry;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;
import java.util.List;

public final class EnquiryDto {

    public record Create(
            @NotBlank @Size(min = 2, max = 120) String name,
            @NotBlank @Pattern(regexp = "^[+0-9 \\-()]{7,20}$", message = "Invalid phone number") String phone,
            @NotBlank @Email String email,
            @Size(max = 80) String city,
            @Size(max = 40) String projectType,
            List<@Size(max = 80) String> materials,
            @Size(max = 120) String quantity,
            @Size(max = 2000) String message
    ) {}

    public record Response(
            Long id, String name, String phone, String email,
            String city, String projectType, List<String> materials,
            String quantity, String message,
            EnquiryStatus status, OffsetDateTime createdAt
    ) {
        public static Response from(Enquiry e) {
            return new Response(e.getId(), e.getName(), e.getPhone(), e.getEmail(),
                    e.getCity(), e.getProjectType(), e.getMaterials(),
                    e.getQuantity(), e.getMessage(),
                    e.getStatus(), e.getCreatedAt());
        }
    }

    public record StatusUpdate(EnquiryStatus status) {}

    private EnquiryDto() {}
}
