package com.listen.data;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "\"users\"", schema = "user_schema")
@Data
public class ListenUser {

  @Id private Integer id;

  @Column(name = "USERNAME")
  private String username;

  @Column(name = "PASSWORD")
  private String password;
}
