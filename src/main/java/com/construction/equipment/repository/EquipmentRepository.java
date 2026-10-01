package com.construction.equipment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.construction.equipment.entity.Equipment;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    List<Equipment> findByCategory(String category);

    List<Equipment> findByLocation(String location);

    List<Equipment> findByStatus(String status);

}