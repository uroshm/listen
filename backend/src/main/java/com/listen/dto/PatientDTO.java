package com.listen.dto;

import com.listen.entity.ListenUser;
import com.listen.entity.Patient;

public record PatientDTO(
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
