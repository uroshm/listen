package com.listen.auth;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

record AuthResponse(String token) {}

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService implements UserDetailsService {
  private final DataSource dataSource;
  private final UserRepository userRepository;
  private final JwtService jwtService;

  public boolean isAuthenticated(String username, String password) {
    try (Connection conn = dataSource.getConnection()) {
      String sql = "SELECT password FROM user_schema.users WHERE username = ?";
      try (PreparedStatement stmt = conn.prepareStatement(sql)) {
        stmt.setString(1, username);

        try (ResultSet rs = stmt.executeQuery()) {
          if (rs.next()) {
            String hashedPassword = rs.getString("password");
            return BCrypt.checkpw(password, hashedPassword);
          }
        }
      }
      return false;
    } catch (SQLException e) {
      log.error("Database authentication error", e);
      return false;
    }
  }

  public String hashPassword(String plainTextPassword) {
    return BCrypt.hashpw(plainTextPassword, BCrypt.gensalt(12));
  }

  public ResponseEntity<?> registerUser(String username, String password) {
    try (Connection conn = dataSource.getConnection()) {
      String checkSql = "SELECT COUNT(*) FROM user_schema.users WHERE username = ?";
      try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
        checkStmt.setString(1, username);
        try (ResultSet rs = checkStmt.executeQuery()) {
          if (rs.next() && rs.getInt(1) > 0) {
            return new ResponseEntity<>("Username already exists", HttpStatus.CONFLICT);
          }
        }
      }

      String hashedPassword = hashPassword(password);
      String insertSql = "INSERT INTO user_schema.users (username, password) VALUES (?, ?)";
      try (PreparedStatement insertStmt = conn.prepareStatement(insertSql)) {
        insertStmt.setString(1, username);
        insertStmt.setString(2, hashedPassword);
        insertStmt.executeUpdate();

        // Generate token for the newly registered user
        String token = jwtService.generateToken(username);
        return ResponseEntity.status(HttpStatus.CREATED)
            .contentType(MediaType.APPLICATION_JSON)
            .body(new AuthResponse(token));
      }
    } catch (SQLException e) {
      log.error("Error registering user", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .contentType(MediaType.APPLICATION_JSON)
          .body(Map.of("message", "Error registering user"));
    }
  }

  public ListenUser findByUsername(String username) {
    return userRepository.findByUsername(username);
  }

  public boolean userDoesNotExist(String username) {
    return true;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    try (Connection conn = dataSource.getConnection()) {
      String sql = "SELECT username, password FROM user_schema.users WHERE username = ?";
      try (PreparedStatement stmt = conn.prepareStatement(sql)) {
        stmt.setString(1, username);

        try (ResultSet rs = stmt.executeQuery()) {
          if (rs.next()) {
            return User.builder()
                .username(rs.getString("username"))
                .password(rs.getString("password"))
                .authorities("ROLE_USER")
                .build();
          } else {
            throw new UsernameNotFoundException("User not found: " + username);
          }
        }
      }
    } catch (SQLException e) {
      throw new UsernameNotFoundException("Error loading user: " + username, e);
    }
  }
}
