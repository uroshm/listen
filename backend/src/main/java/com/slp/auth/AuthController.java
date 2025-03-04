package com.slp.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/auth")
@Slf4j
public class AuthController {

    @Value("${auth.username}")
    private String username;

    @Value("${auth.password}")
    private String password;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome this endpoint is not secure";
    }

    @GetMapping("/user/userProfile")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public String userProfile() {
        return "Welcome to User Profile";
    }

    @GetMapping("/admin/adminProfile")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String adminProfile() {
        return "Welcome to Admin Profile";
    }

    record AuthRequest(String username, String password) {
    }

    record AuthResponse(String token) {
    }

    @PostMapping("/login")
    @CrossOrigin("http://localhost:5173")
    public AuthResponse authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        log.info("Auth Request: {}", authRequest.toString());
        boolean isAuthenticated = authRequest.username().equals(username) && authRequest.password().equals(password);

        if (isAuthenticated) {
            log.info("returning: " + new AuthResponse(jwtService.generateToken(authRequest.username())));
            return new AuthResponse(jwtService.generateToken(authRequest.username()));

        } else {
            throw new UsernameNotFoundException("Invalid user request!");
        }
    }
}
