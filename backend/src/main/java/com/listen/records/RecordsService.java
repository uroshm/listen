package com.listen.records;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.listen.auth.ListenUser;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Service
@Slf4j
public class RecordsService {

  private final PatientRepository patientRepository;
  private final PatientTestRepository patientTestRepository;

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

  public PatientTestDTO createTest(
      MultipartFile file, PatientTestDTO patientTestDTO, ListenUser user) {
    try {
      var patient =
          findPatientById(patientTestDTO.patientId())
              .orElseThrow(() -> new RuntimeException("Patient ID not provided"));
      if (patient.getUser() != user) {
        throw new RuntimeException("You are not authorized to create test for this patient.");
      }

      var test = new PatientTest();

      test.setPatient(patient);
      test.setTestName(patientTestDTO.testName());
      test.setTestType(patientTestDTO.testType());
      test.setTestDetails(patientTestDTO.testDetails());
      test.setTestDate(patientTestDTO.testDate());
      test.setTestData(patientTestDTO.testData());
      test.setTestAudio(file.getBytes());
      test.setTestAnalysis(patientTestDTO.testAnalysis());
      patientTestRepository.save(test);
      return patientTestDTO;
    } catch (Exception e) {
      log.error("Error creating test: {}", e.getMessage());
      throw new RuntimeException("Failed to create test", e);
    }
  }

  public List<PatientTest> getTests(ListenUser user) {
    return patientTestRepository.findAllByUser(user);
  }

  public List<PatientTest> getTestsByPatientId(Long patientId, ListenUser user) {
    Patient patient =
        findPatientById(patientId).orElseThrow(() -> new RuntimeException("Patient not found"));

    if (user != null) {
      validateUser(user, patient);
    }

    return patientTestRepository.findByPatientId(patientId);
  }
}
