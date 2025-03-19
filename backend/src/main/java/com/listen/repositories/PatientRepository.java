package com.listen.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.listen.data.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {}
