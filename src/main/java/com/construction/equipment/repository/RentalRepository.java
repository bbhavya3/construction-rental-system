package com.construction.equipment.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.construction.equipment.entity.Rental;

public interface RentalRepository extends JpaRepository<Rental, Long> {

    List<Rental> findByEquipmentId(Long equipmentId);

    List<Rental> findByEquipmentIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long equipmentId,
            LocalDate endDate,
            LocalDate startDate
    );
}