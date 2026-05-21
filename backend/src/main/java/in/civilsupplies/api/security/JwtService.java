package in.civilsupplies.api.security;

import in.civilsupplies.api.config.AppProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class JwtService {

    private final AppProperties props;
    private final SecretKey signingKey;

    public JwtService(AppProperties props) {
        this.props = props;
        byte[] keyBytes = props.jwt().secret().getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException("JWT secret must be at least 32 bytes (256 bits).");
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public Issued issueAccessToken(String email, List<String> roles, Long userId) {
        Instant now = Instant.now();
        Instant exp = now.plus(props.jwt().accessTtlMinutes(), ChronoUnit.MINUTES);
        String token = Jwts.builder()
                .subject(email)
                .issuer(props.jwt().issuer())
                .id(UUID.randomUUID().toString())
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .claims(Map.of("uid", userId, "roles", roles, "type", "access"))
                .signWith(signingKey)
                .compact();
        return new Issued(token, exp);
    }

    public Issued issueRefreshToken(String email, Long userId) {
        Instant now = Instant.now();
        Instant exp = now.plus(props.jwt().refreshTtlMinutes(), ChronoUnit.MINUTES);
        String token = Jwts.builder()
                .subject(email)
                .issuer(props.jwt().issuer())
                .id(UUID.randomUUID().toString())
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .claims(Map.of("uid", userId, "type", "refresh"))
                .signWith(signingKey)
                .compact();
        return new Issued(token, exp);
    }

    public Claims parse(String token) throws JwtException {
        return Jwts.parser()
                .verifyWith(signingKey)
                .requireIssuer(props.jwt().issuer())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public record Issued(String token, Instant expiresAt) {}
}
