package com.construction.equipment.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "equipment_id")
    @NotNull
    private Equipment equipment;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @PositiveOrZero
    private Double estimatedAmount = 0.0;

    @NotNull
    private String status;

    public Booking() {
    }

    public Booking(
            Equipment equipment,
            LocalDate startDate,
            LocalDate endDate,
            Double estimatedAmount,
            String status) {

        this.equipment = equipment;
        this.startDate = startDate;
        this.endDate = endDate;
        this.estimatedAmount = estimatedAmount;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Equipment getEquipment() {
        return equipment;
    }

    public void setEquipment(Equipment equipment) {
        this.equipment = equipment;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Double getEstimatedAmount() {
        return estimatedAmount;
    }

    public void setEstimatedAmount(Double estimatedAmount) {
        this.estimatedAmount = estimatedAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}