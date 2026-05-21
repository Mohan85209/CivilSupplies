package in.civilsupplies.api.enquiry;

import in.civilsupplies.api.common.PageResponse;
import in.civilsupplies.api.common.RateLimiter;
import in.civilsupplies.api.config.AppProperties;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {

    private final EnquiryService service;
    private final RateLimiter rateLimiter;
    private final AppProperties props;

    public EnquiryController(EnquiryService service, RateLimiter rateLimiter, AppProperties props) {
        this.service = service;
        this.rateLimiter = rateLimiter;
        this.props = props;
    }

    @PostMapping
    public ResponseEntity<EnquiryDto.Response> submit(
            @Valid @RequestBody EnquiryDto.Create payload,
            HttpServletRequest req
    ) {
        rateLimiter.enforce(req, "enquiries", props.ratelimit().enquiriesPerHour());
        var saved = service.create(payload);
        return ResponseEntity.created(URI.create("/api/enquiries/" + saved.getId()))
                .body(EnquiryDto.Response.from(saved));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public PageResponse<EnquiryDto.Response> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) EnquiryStatus status
    ) {
        return PageResponse.of(service.list(page, size, status), EnquiryDto.Response::from);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public EnquiryDto.Response updateStatus(@PathVariable Long id, @RequestBody EnquiryDto.StatusUpdate payload) {
        return EnquiryDto.Response.from(service.updateStatus(id, payload.status()));
    }
}
