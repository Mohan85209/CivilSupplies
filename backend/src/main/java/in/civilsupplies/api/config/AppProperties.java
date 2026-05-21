package in.civilsupplies.api.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Validated
@ConfigurationProperties(prefix = "app")
public record AppProperties(
        Cors cors,
        Jwt jwt,
        Storage storage,
        Notification notification,
        RateLimit ratelimit
) {
    public record Cors(List<String> allowedOrigins) {}

    public record Jwt(
            @NotBlank String secret,
            @NotBlank String issuer,
            @Positive long accessTtlMinutes,
            @Positive long refreshTtlMinutes
    ) {}

    public record Storage(
            String type,
            String localDir,
            String s3Bucket,
            String s3Region
    ) {}

    public record Notification(String from, String adminTo) {}

    public record RateLimit(
            int enquiriesPerHour,
            int quotesPerHour,
            int newsletterPerHour
    ) {}
}
