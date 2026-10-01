package com.construction.equipment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.construction.equipment.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

}