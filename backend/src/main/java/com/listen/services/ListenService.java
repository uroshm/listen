package com.listen.services;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.listen.data.Patient;
import com.listen.repositories.PatientRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@Service
public class ListenService {

  private final PatientRepository patientRepository;

  public List<Patient> getAllPatients() {
    return patientRepository.findAll();
  }
}
