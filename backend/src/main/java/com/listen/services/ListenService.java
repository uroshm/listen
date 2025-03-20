package com.listen.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.listen.dto.PatientDTO;
import com.listen.entity.ListenUser;
import com.listen.entity.Patient;
import com.listen.repositories.PatientRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Service
@Slf4j
public class ListenService {

  private final PatientRepository patientRepository;

  public List<Patient> getPatientsByUser() {
    return patientRepository.findAll();
  }

  public List<Patient> getPatientsByUser(ListenUser currentUser) {
    return patientRepository.findByUser(currentUser);
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
}
