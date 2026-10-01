package com.construction.equipment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.construction.equipment.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

}