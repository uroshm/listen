package com.listen.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.listen.auth.AuthService;
import com.listen.data.Patient;
import com.listen.services.ListenService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/listen")
@RequiredArgsConstructor
@Slf4j
public class ListenController {

  private final ListenService listenService;
  private final AuthService authService;

  @CrossOrigin(origins = "http://localhost:5173")
  @GetMapping("/getMyPatients")
  // @PreAuthorize("hasAuthority('ROLE_USER')")
  public List<Patient> getAllPatients(Authentication authentication) {
    log.info("uki ;; " + authentication.getPrincipal().toString());
    var username = authentication.getName();
    var currentUser = authService.findByUsername(username);
    return listenService.getPatientsByUser(currentUser);
  }
}
