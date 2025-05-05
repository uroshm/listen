package com.listen.records;

public record PatientTestDTO(
    String testName,
    String testType,
    String testDetails,
    String testDate,
    String testData,
    byte[] testAudio,
    String testAnalysis,
    Long patientId) {

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

  public static PatientTestDTO fromEntity(PatientTest test) {
    return new PatientTestDTO(
        test.getTestName(),
        test.getTestType(),
        test.getTestDetails(),
        test.getTestDate(),
        test.getTestData(),
        test.getTestAudio(),
        test.getTestAnalysis(),
        test.getPatient().getId());
  }
}
