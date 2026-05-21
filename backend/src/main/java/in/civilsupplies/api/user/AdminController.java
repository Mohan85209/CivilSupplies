package in.civilsupplies.api.user;

import in.civilsupplies.api.security.AuthenticatedUser;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminUserService service;

    public AdminController(AdminUserService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public AdminUserDto.LoginResponse login(@Valid @RequestBody AdminUserDto.LoginRequest req) {
        return service.login(req);
    }

    @PostMapping("/refresh")
    public AdminUserDto.LoginResponse refresh(@Valid @RequestBody AdminUserDto.RefreshRequest req) {
        return service.refresh(req);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public AdminUserDto.Response me(@AuthenticationPrincipal AuthenticatedUser principal) {
        return AdminUserDto.Response.from(service.getByEmail(principal.email()));
    }

    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public List<AdminUserDto.Response> listUsers() {
        return service.list().stream().map(AdminUserDto.Response::from).toList();
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminUserDto.Response create(@Valid @RequestBody AdminUserDto.CreateRequest req) {
        return AdminUserDto.Response.from(service.create(req));
    }
}
