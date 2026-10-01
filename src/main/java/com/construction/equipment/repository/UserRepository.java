package com.construction.equipment.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.construction.equipment.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}