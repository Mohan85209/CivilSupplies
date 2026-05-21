package in.civilsupplies.api.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

public final class AdminUserDto {

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8, max = 100) String password
    ) {}

    public record RefreshRequest(@NotBlank String refreshToken) {}

    public record LoginResponse(
            String token, String refreshToken, OffsetDateTime expiresAt, Response user
    ) {}

    public record CreateRequest(
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8, max = 100) String password,
            @Size(max = 160) String fullName,
            @NotEmpty Set<String> roles
    ) {}

    public record Response(
            Long id, String email, String fullName, List<String> roles, OffsetDateTime createdAt, boolean active
    ) {
        public static Response from(AdminUser u) {
            return new Response(u.getId(), u.getEmail(), u.getFullName(),
                    u.getRoles().stream().sorted().toList(), u.getCreatedAt(), u.isActive());
        }
    }

    private AdminUserDto() {}
}
