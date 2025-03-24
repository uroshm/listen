package com.listen.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.listen.auth.AuthService;
import com.listen.dto.PatientDTO;
import com.listen.entity.ListenUser;
import com.listen.entity.Patient;
import com.listen.entity.PatientTest;
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

  @CrossOrigin(origins = "http://localhost:8081")
  @GetMapping("/getMyPatients")
  @PreAuthorize("hasAuthority('ROLE_USER')")
  public List<PatientDTO> getAllPatients(Authentication authentication) {
    var username = authentication.getName();
    var currentUser = authService.findByUsername(username);
    return listenService.getPatientsByUser(currentUser);
  }

  @CrossOrigin(origins = "http://localhost:8081")
  @PostMapping("/createPatient")
  @PreAuthorize("hasAuthority('ROLE_USER')")
  public ResponseEntity<Patient> createPatient(
      @RequestBody PatientDTO patientDTO, Authentication authentication) {
    ListenUser currentUser = authService.findByUsername(authentication.getName());
    Patient patient = patientDTO.toEntity(currentUser);
    Patient savedPatient = listenService.createPatient(patient);
    return ResponseEntity.ok(savedPatient);
  }

  @CrossOrigin(origins = "http://localhost:8081")
  @PutMapping("/editPatient/{id}")
  @PreAuthorize("hasAuthority('ROLE_USER')")
  public ResponseEntity<Patient> editPatient(
      @PathVariable Long id, @RequestBody PatientDTO patientDTO, Authentication authentication) {
    ListenUser currentUser = authService.findByUsername(authentication.getName());
    return ResponseEntity.ok(listenService.editPatient(id, patientDTO, currentUser));
  }

  @CrossOrigin(origins = "http://localhost:8081")
  @PostMapping(value = "/createTest", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  // @PreAuthorize("hasAuthority('ROLE_USER')")
  public ResponseEntity<PatientTest> createTest(
      @RequestParam("file") MultipartFile file,
      PatientDTO patientDTO,
      Authentication authentication) {
    ListenUser currentUser = authService.findByUsername(authentication.getName());
    Patient patient = patientDTO.toEntity(currentUser);
    return ResponseEntity.ok(listenService.createTest(file));
  }

  @CrossOrigin(origins = "http://localhost:8081")
  @GetMapping("/getTests")
  public ResponseEntity<List<PatientTest>> getTests() {
    return ResponseEntity.ok(listenService.getTests());
  }
}
