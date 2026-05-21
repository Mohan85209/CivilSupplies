package in.civilsupplies.api.user;

import in.civilsupplies.api.exception.ApiException;
import in.civilsupplies.api.security.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminUserService {

    private final AdminUserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AdminUserService(AdminUserRepository repo, PasswordEncoder encoder, JwtService jwt) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public AdminUserDto.LoginResponse login(AdminUserDto.LoginRequest req) {
        var user = repo.findByEmailIgnoreCase(req.email())
                .orElseThrow(() -> ApiException.unauthorized("Invalid email or password."));
        if (!user.isActive()) throw ApiException.unauthorized("Account is disabled.");
        if (!encoder.matches(req.password(), user.getPasswordHash())) {
            throw ApiException.unauthorized("Invalid email or password.");
        }
        return issueTokens(user);
    }

    public AdminUserDto.LoginResponse refresh(AdminUserDto.RefreshRequest req) {
        Claims claims;
        try {
            claims = jwt.parse(req.refreshToken());
        } catch (JwtException e) {
            throw ApiException.unauthorized("Invalid refresh token.");
        }
        if (!"refresh".equals(claims.get("type", String.class))) {
            throw ApiException.unauthorized("Invalid token type.");
        }
        var user = repo.findById(claims.get("uid", Long.class))
                .orElseThrow(() -> ApiException.unauthorized("User no longer exists."));
        if (!user.isActive()) throw ApiException.unauthorized("Account disabled.");
        return issueTokens(user);
    }

    @Transactional
    public AdminUser create(AdminUserDto.CreateRequest req) {
        if (repo.existsByEmailIgnoreCase(req.email())) {
            throw ApiException.conflict("A user with that email already exists.");
        }
        var u = new AdminUser();
        u.setEmail(req.email().trim().toLowerCase());
        u.setPasswordHash(encoder.encode(req.password()));
        u.setFullName(req.fullName());
        u.setActive(true);
        u.setRoles(new java.util.HashSet<>(req.roles()));
        return repo.save(u);
    }

    public List<AdminUser> list() {
        return repo.findAll();
    }

    public AdminUser get(Long id) {
        return repo.findById(id).orElseThrow(() -> ApiException.notFound("User"));
    }

    public AdminUser getByEmail(String email) {
        return repo.findByEmailIgnoreCase(email).orElseThrow(() -> ApiException.notFound("User"));
    }

    private AdminUserDto.LoginResponse issueTokens(AdminUser user) {
        var roles = user.getRoles().stream().sorted().toList();
        var access = jwt.issueAccessToken(user.getEmail(), roles, user.getId());
        var refresh = jwt.issueRefreshToken(user.getEmail(), user.getId());
        return new AdminUserDto.LoginResponse(
                access.token(),
                refresh.token(),
                java.time.OffsetDateTime.ofInstant(access.expiresAt(), java.time.ZoneOffset.UTC),
                AdminUserDto.Response.from(user)
        );
    }
}
