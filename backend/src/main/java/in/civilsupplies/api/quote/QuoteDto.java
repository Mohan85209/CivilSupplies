package in.civilsupplies.api.quote;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;

public final class QuoteDto {

    public record Create(
            @NotBlank @Size(min = 2, max = 120) String name,
            @NotBlank @Pattern(regexp = "^[+0-9 \\-()]{7,20}$") String phone,
            @NotBlank @Email String email,
            @Size(max = 5000) String projectDetails,
            @Size(max = 200) String siteLocation,
            @Size(max = 120) String timeline
    ) {}

    public record Response(
            Long id, String name, String phone, String email,
            String projectDetails, String siteLocation, String timeline,
            String boqFilename, String boqFileUrl,
            QuoteStatus status, OffsetDateTime createdAt
    ) {
        public static Response from(Quote q) {
            return new Response(q.getId(), q.getName(), q.getPhone(), q.getEmail(),
                    q.getProjectDetails(), q.getSiteLocation(), q.getTimeline(),
                    q.getBoqFilename(), q.getBoqFileUrl(),
                    q.getStatus(), q.getCreatedAt());
        }
    }

    public record StatusUpdate(QuoteStatus status) {}

    private QuoteDto() {}
}
