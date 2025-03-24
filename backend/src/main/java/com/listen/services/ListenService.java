package com.listen.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.listen.dto.PatientDTO;
import com.listen.dto.PatientTestDTO;
import com.listen.entity.ListenUser;
import com.listen.entity.Patient;
import com.listen.entity.PatientTest;
import com.listen.repositories.PatientRepository;
import com.listen.repositories.PatientTestRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Service
@Slf4j
public class ListenService {

  private final PatientRepository patientRepository;
  private final PatientTestRepository patientTestRepository;

  public List<Patient> getPatientsByUser() {
    return patientRepository.findAll();
  }

  public List<PatientDTO> getPatientsByUser(ListenUser currentUser) {
    return patientRepository.findByUser(currentUser).stream().map(Patient::convertToDTO).toList();
  }

  public Patient createPatient(Patient patient) {
    try {
      return patientRepository.save(patient);
    } catch (Exception e) {
      log.error("Error creating patient: {}", e.getMessage());
      throw new RuntimeException("Failed to create patient", e);
    }
  }

  public Patient editPatient(Long id, PatientDTO patientDTO, ListenUser currentUser) {
    try {
      var existingPatient =
          findPatientById(id).orElseThrow(() -> new RuntimeException("Patient not found"));
      validateUser(currentUser, existingPatient);

      var updatedPatient = patientDTO.toUpdateEntity(existingPatient);
      updatedPatient.setUser(updatedPatient.getUser());

      return patientRepository.save(updatedPatient);
    } catch (Exception e) {
      log.error("Error updating patient: {}", e.getMessage());
      throw new RuntimeException("Failed to update patient", e);
    }
  }

  public Optional<Patient> findPatientById(Long id) {
    return patientRepository.findById(id);
  }

  private void validateUser(ListenUser currentUser, Patient existingPatient) {
    if (!existingPatient.getUser().equals(currentUser)) {
      throw new RuntimeException("You are not authorized to update this patient.");
    }
  }

  public PatientTest createTest(MultipartFile file) {
    try {
      var testDTO =
          new PatientTestDTO(
              "testName",
              "testType",
              "testDetails",
              "testDate",
              "testData",
              file.getBytes(),
              "testAnalysis",
              new PatientDTO(
                  "patientName",
                  "patientAge",
                  "patientGender",
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null));
      Patient temp = new Patient();
      patientRepository.save(temp);
      return patientTestRepository.save(testDTO.toEntity(temp));
    } catch (Exception e) {
      log.error("Error creating test: {}", e.getMessage());
      throw new RuntimeException("Failed to create test", e);
    }
  }

  public List<PatientTest> getTests() {
    return patientTestRepository.findAll();
  }
}
