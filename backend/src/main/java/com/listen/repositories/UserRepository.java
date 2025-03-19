package com.listen.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.listen.entity.ListenUser;

@Repository
public interface UserRepository extends JpaRepository<ListenUser, Long> {
  ListenUser findByUsername(String username);
}
