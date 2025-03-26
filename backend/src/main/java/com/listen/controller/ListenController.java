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
import com.listen.dto.PatientTestDTO;
import com.listen.entity.ListenUser;
import com.listen.entity.Patient;
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
  public ResponseEntity<PatientDTO> createPatient(
      @RequestBody PatientDTO patientDTO, Authentication authentication) {
    ListenUser currentUser = authService.findByUsername(authentication.getName());
    Patient patient = patientDTO.toEntity(currentUser);
    listenService.createPatient(patient);
    return ResponseEntity.ok(patientDTO);
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
  @PreAuthorize("hasAuthority('ROLE_USER')")
  public ResponseEntity<PatientTestDTO> createTest(
      @RequestParam("file") MultipartFile file,
      PatientTestDTO patientTestDTO,
      Authentication authentication) {
    ListenUser currentUser = authService.findByUsername(authentication.getName());
    return ResponseEntity.ok(listenService.createTest(file, patientTestDTO, currentUser));
  }

  @CrossOrigin(origins = "http://localhost:8081")
  @GetMapping("/getTests")
  @PreAuthorize("hasAuthority('ROLE_USER')")
  public ResponseEntity<List<PatientTestDTO>> getTests(
      @RequestParam(required = false) Long patientId, Authentication authentication) {

    if (patientId != null) {
      return ResponseEntity.ok(
          listenService
              .getTestsByPatientId(patientId, authService.findByUsername(authentication.getName()))
              .stream()
              .map(PatientTestDTO::fromEntity)
              .toList());
    } else {
      return ResponseEntity.ok(
          listenService.getTests(authService.findByUsername(authentication.getName())).stream()
              .map(PatientTestDTO::fromEntity)
              .toList());
    }
  }
}
