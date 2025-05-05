package com.listen.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<ListenUser, Long> {
  ListenUser findByUsername(String username);
}
