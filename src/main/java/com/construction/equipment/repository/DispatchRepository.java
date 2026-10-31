package com.construction.equipment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.construction.equipment.entity.Dispatch;

public interface DispatchRepository extends JpaRepository<Dispatch, Long> {
}