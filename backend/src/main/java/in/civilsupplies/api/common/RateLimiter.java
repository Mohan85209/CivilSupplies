package in.civilsupplies.api.common;

import in.civilsupplies.api.exception.ApiException;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * Per-client rate limiter using Bucket4j.
 *
 * <p>Client identity is derived from {@link HttpServletRequest#getRemoteAddr()} only.
 * Spring's ForwardedHeaderFilter (enabled via
 * {@code server.forward-headers-strategy: framework} in {@code application.yml})
 * resolves {@code X-Forwarded-For} when the request arrives via a configured trusted
 * proxy — so we never trust the raw header here. This prevents bypass by clients
 * spoofing XFF.
 */
@Component
public class RateLimiter {

    private final ConcurrentMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    public void enforce(HttpServletRequest req, String bucketKey, int perHour) {
        String clientId = req.getRemoteAddr();
        if (clientId == null || clientId.isBlank()) clientId = "unknown";
        String key = bucketKey + ":" + clientId;
        Bucket bucket = buckets.computeIfAbsent(key, k ->
                Bucket.builder().addLimit(Bandwidth.simple(perHour, Duration.ofHours(1))).build());
        if (!bucket.tryConsume(1)) {
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS,
                    "Too many requests. Try again in an hour.");
        }
    }
}
