package com.listen.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

  private final JwtService jwtService;
  private final AuthService authService;

  record RegisterRequest(String username, String password) {}

  @PostMapping("/register")
  @CrossOrigin("http://localhost:8081")
  public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
    return authService.registerUser(registerRequest.username(), registerRequest.password());
  }

  record AuthRequest(String username, String password) {}

  @PostMapping(path = "/login")
  @CrossOrigin("http://localhost:8081")
  public ResponseEntity<?> authenticate(@RequestBody AuthRequest authRequest) {
    if (authService.isAuthenticated(authRequest.username(), authRequest.password())) {
      return new ResponseEntity<>(jwtService.generateToken(authRequest.username()), HttpStatus.OK);
    } else {
      return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }
  }
}
