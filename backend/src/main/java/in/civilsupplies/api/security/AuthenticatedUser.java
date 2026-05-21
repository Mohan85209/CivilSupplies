package in.civilsupplies.api.security;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

public record AuthenticatedUser(Long id, String email, List<SimpleGrantedAuthority> authorities) {}
