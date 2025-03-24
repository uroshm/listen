package com.listen.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "\"tests\"", schema = "user_schema")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientTest {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "PATIENT_ID")
  private Patient patient;

  @Column(name = "TEST_NAME")
  private String testName;

  @Column(name = "TEST_TYPE")
  private String testType;

  @Column(name = "TEST_DETAILS")
  private String testDetails;

  @Column(name = "TEST_DATE")
  private String testDate;

  @Column(name = "TEST_DATA")
  private String testData;

  @Column(name = "TEST_AUDIO")
  private byte[] testAudio;

  @Column(name = "TEST_ANALYSIS")
  private String testAnalysis;
}
