package com.listen.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.listen.entity.ListenUser;
import com.listen.entity.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

  List<Patient> findByUser(ListenUser currentUser);
}
