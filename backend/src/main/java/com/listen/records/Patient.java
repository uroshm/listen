package com.listen.records;

import com.listen.auth.ListenUser;

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
@Table(name = "\"patients\"", schema = "user_schema")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Patient {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "USER_ID")
  private ListenUser user;

  @Column(name = "FIRST_NAME")
  private String firstName;

  @Column(name = "LAST_NAME")
  private String lastName;

  @Column(name = "IEP_DATE")
  private String iepDate;

  @Column(name = "EVAL_DATE")
  private String evalDate;

  @Column(name = "SCHOOL")
  private String school;

  @Column(name = "THERAPY_TYPE")
  private String therapyType;

  @Column(name = "TEACHER")
  private String teacher;

  @Column(name = "ROOM_NUMBER")
  private String roomNumber;

  @Column(name = "GRADE_LEVEL")
  private String gradeLevel;

  @Column(name = "DOB")
  private String dob;

  public PatientDTO convertToDTO() {
    return new PatientDTO(
        id,
        firstName,
        lastName,
        iepDate,
        evalDate,
        school,
        therapyType,
        teacher,
        roomNumber,
        gradeLevel,
        dob);
  }
}
