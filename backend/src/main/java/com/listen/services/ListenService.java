package com.listen.services;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

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
}
