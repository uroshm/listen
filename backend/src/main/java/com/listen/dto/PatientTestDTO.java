package com.listen.dto;

import com.listen.entity.Patient;
import com.listen.entity.PatientTest;

public record PatientTestDTO(
    String testName,
    String testType,
    String testDetails,
    String testDate,
    String testData,
    byte[] testAudio,
    String testAnalysis,
    PatientDTO patientDTO) {

  public PatientTest toEntity(Patient patient) {
    PatientTest test = new PatientTest();
    test.setTestName(testName);
    test.setTestType(testType);
    test.setTestDetails(testDetails);
    test.setTestDate(testDate);
    test.setTestData(testData);
    test.setTestAudio(testAudio);
    test.setTestAnalysis(testAnalysis);
    test.setPatient(patient);
    return test;
  }
}
