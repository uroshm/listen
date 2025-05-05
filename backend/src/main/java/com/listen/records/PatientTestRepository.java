package com.listen.records;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.listen.auth.ListenUser;

@Repository
public interface PatientTestRepository extends JpaRepository<PatientTest, Long> {

  List<PatientTest> findByPatientId(Long patientId);

  @Query("SELECT pt FROM PatientTest pt WHERE pt.patient.user = :user")
  List<PatientTest> findAllByUser(@Param("user") ListenUser user);
}
