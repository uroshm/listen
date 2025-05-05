package com.listen.records;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.listen.auth.ListenUser;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

  List<Patient> findByUser(ListenUser currentUser);
}
