package in.civilsupplies.api.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final CorsConfigurationSource corsSource;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter, CorsConfigurationSource corsSource) {
        this.jwtFilter = jwtFilter;
        this.corsSource = corsSource;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .cors(c -> c.configurationSource(corsSource))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // public health & docs
                        .requestMatchers("/health", "/actuator/health", "/actuator/info").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()

                        // public catalog
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()

                        // public form submissions (rate-limited at controller layer)
                        .requestMatchers(HttpMethod.POST, "/api/enquiries").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/quotes").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/newsletter/subscribe").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/admin/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/admin/refresh").permitAll()

                        // admin user creation: only ROLE_ADMIN
                        .requestMatchers(HttpMethod.POST, "/api/admin/users").hasRole("ADMIN")

                        // everything else under /api/** requires authentication
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll()
                )
                .headers(h -> h.frameOptions(f -> f.sameOrigin()))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
