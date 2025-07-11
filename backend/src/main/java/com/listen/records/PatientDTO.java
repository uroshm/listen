package com.listen.records;

import com.listen.auth.ListenUser;

public record PatientDTO(
    Long id,
    String firstName,
    String lastName,
    String iepDate,
    String evalDate,
    String school,
    String therapyType,
    String teacher,
    String roomNumber,
    String gradeLevel,
    String dob) {

  public Patient toEntity(ListenUser user) {
    Patient patient = new Patient();
    patient.setId(id);
    patient.setFirstName(firstName);
    patient.setLastName(lastName);
    patient.setIepDate(iepDate);
    patient.setEvalDate(evalDate);
    patient.setSchool(school);
    patient.setTherapyType(therapyType);
    patient.setTeacher(teacher);
    patient.setRoomNumber(roomNumber);
    patient.setGradeLevel(gradeLevel);
    patient.setDob(dob);
    patient.setUser(user);
    return patient;
  }

  public Patient toUpdateEntity(Patient existingPatient) {
    existingPatient.setId(id);
    existingPatient.setFirstName(firstName);
    existingPatient.setLastName(lastName);
    existingPatient.setIepDate(iepDate);
    existingPatient.setEvalDate(evalDate);
    existingPatient.setSchool(school);
    existingPatient.setTherapyType(therapyType);
    existingPatient.setTeacher(teacher);
    existingPatient.setRoomNumber(roomNumber);
    existingPatient.setGradeLevel(gradeLevel);
    existingPatient.setDob(dob);
    return existingPatient;
  }
}
