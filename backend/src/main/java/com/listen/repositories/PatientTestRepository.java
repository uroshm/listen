package com.listen.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.listen.entity.PatientTest;

@Repository
public interface PatientTestRepository extends JpaRepository<PatientTest, Long> {}
