package in.civilsupplies.api.security;

import in.civilsupplies.api.config.AppProperties;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private final AppProperties props = new AppProperties(
            new AppProperties.Cors(List.of("http://localhost")),
            new AppProperties.Jwt("this-is-a-32-byte-long-test-secret-for-jwt-signing-please", "civilsupplies-api", 60, 1440),
            new AppProperties.Storage("local", "./build/test", "", "ap-south-1"),
            new AppProperties.Notification("from@example.com", "to@example.com"),
            new AppProperties.RateLimit(1000, 1000, 1000)
    );

    private final JwtService jwt = new JwtService(props);

    @Test
    void issuesParseableAccessToken() {
        var issued = jwt.issueAccessToken("admin@example.com", List.of("ROLE_ADMIN"), 42L);
        Claims claims = jwt.parse(issued.token());
        assertThat(claims.getSubject()).isEqualTo("admin@example.com");
        assertThat(claims.get("uid", Long.class)).isEqualTo(42L);
        assertThat(claims.get("type", String.class)).isEqualTo("access");
        assertThat(claims.get("roles", List.class)).containsExactly("ROLE_ADMIN");
    }

    @Test
    void rejectsTokenSignedWithDifferentSecret() {
        var otherProps = new AppProperties(
                props.cors(),
                new AppProperties.Jwt("another-32-byte-long-secret-for-the-jwt-impl-please-x", props.jwt().issuer(), 60, 1440),
                props.storage(), props.notification(), props.ratelimit()
        );
        var otherJwt = new JwtService(otherProps);
        var issued = otherJwt.issueAccessToken("x@y.com", List.of(), 1L);
        assertThatThrownBy(() -> jwt.parse(issued.token())).isInstanceOf(io.jsonwebtoken.JwtException.class);
    }

    @Test
    void refreshTokenTypeIsRefresh() {
        var issued = jwt.issueRefreshToken("admin@example.com", 7L);
        assertThat(jwt.parse(issued.token()).get("type", String.class)).isEqualTo("refresh");
    }
}
