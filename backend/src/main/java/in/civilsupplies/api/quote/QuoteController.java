package in.civilsupplies.api.quote;

import com.fasterxml.jackson.databind.ObjectMapper;
import in.civilsupplies.api.common.PageResponse;
import in.civilsupplies.api.common.RateLimiter;
import in.civilsupplies.api.config.AppProperties;
import in.civilsupplies.api.exception.ApiException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/api/quotes")
public class QuoteController {

    private final QuoteService service;
    private final RateLimiter rateLimiter;
    private final AppProperties props;
    private final ObjectMapper objectMapper;
    private final Validator validator;

    public QuoteController(QuoteService service, RateLimiter rateLimiter, AppProperties props,
                           ObjectMapper objectMapper, Validator validator) {
        this.service = service;
        this.rateLimiter = rateLimiter;
        this.props = props;
        this.objectMapper = objectMapper;
        this.validator = validator;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<QuoteDto.Response> submit(
            @RequestPart("quote") String quoteJson,
            @RequestPart(value = "boq", required = false) MultipartFile boq,
            HttpServletRequest req
    ) throws IOException {
        rateLimiter.enforce(req, "quotes", props.ratelimit().quotesPerHour());

        QuoteDto.Create payload;
        try {
            payload = objectMapper.readValue(quoteJson, QuoteDto.Create.class);
        } catch (IOException e) {
            throw ApiException.badRequest("Invalid quote payload.");
        }
        var violations = validator.validate(payload);
        if (!violations.isEmpty()) {
            String msg = violations.iterator().next().getMessage();
            throw ApiException.badRequest("Validation failed: " + msg);
        }

        var saved = service.create(payload, boq);
        return ResponseEntity.created(URI.create("/api/quotes/" + saved.getId()))
                .body(QuoteDto.Response.from(saved));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public PageResponse<QuoteDto.Response> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) QuoteStatus status
    ) {
        return PageResponse.of(service.list(page, size, status), QuoteDto.Response::from);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public QuoteDto.Response updateStatus(@PathVariable Long id, @RequestBody @Valid QuoteDto.StatusUpdate payload) {
        return QuoteDto.Response.from(service.updateStatus(id, payload.status()));
    }

    @GetMapping("/{id}/boq")
    @PreAuthorize("isAuthenticated()")
    public Map<String, String> getBoqUrl(@PathVariable Long id) {
        var q = service.get(id);
        if (q.getBoqFileUrl() == null) throw ApiException.notFound("BOQ file");
        return Map.of("url", q.getBoqFileUrl());
    }
}
