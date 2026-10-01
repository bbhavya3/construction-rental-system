package com.construction.equipment.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.construction.equipment.entity.Booking;
import com.construction.equipment.entity.Equipment;
import com.construction.equipment.repository.EquipmentRepository;
import com.construction.equipment.repository.BookingRepository;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final EquipmentRepository equipmentRepository;

    public BookingController(
            BookingRepository bookingRepository,
            EquipmentRepository equipmentRepository) {

        this.bookingRepository = bookingRepository;
        this.equipmentRepository = equipmentRepository;
    }

    @PostMapping
    public Booking addBooking(
            @RequestBody BookingRequest request) {

        if (request.getEquipment() == null ||
            request.getEquipment().getId() == null) {

            throw new IllegalArgumentException(
                    "Equipment is required");
        }

        if (request.getStartDate() == null ||
            request.getEndDate() == null) {

            throw new IllegalArgumentException(
                    "Start date and end date are required");
        }

        if (request.getEstimatedAmount() == null) {

            throw new IllegalArgumentException(
                    "Estimated amount is required");
        }

        Equipment equipment =
                equipmentRepository
                        .findById(request.getEquipment().getId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Equipment not found"));

        Booking booking = new Booking();

        booking.setEquipment(equipment);
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setEstimatedAmount(
                request.getEstimatedAmount());
        booking.setStatus(
                request.getStatus() != null
                        ? request.getStatus()
                        : "PENDING");

        return bookingRepository.save(booking);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @GetMapping("/{id}")
    public Booking getBookingById(
            @PathVariable Long id) {

        return bookingRepository
                .findById(id)
                .orElse(null);
    }

    @DeleteMapping("/{id}")
    public String deleteBooking(
            @PathVariable Long id) {

        bookingRepository.deleteById(id);

        return "Booking deleted successfully";
    }

    public static class BookingRequest {

        private EquipmentRequest equipment;

        private java.time.LocalDate startDate;

        private java.time.LocalDate endDate;

        private Double estimatedAmount;

        private String status;

        public BookingRequest() {
        }

        public EquipmentRequest getEquipment() {
            return equipment;
        }

        public void setEquipment(
                EquipmentRequest equipment) {

            this.equipment = equipment;
        }

        public java.time.LocalDate getStartDate() {
            return startDate;
        }

        public void setStartDate(
                java.time.LocalDate startDate) {

            this.startDate = startDate;
        }

        public java.time.LocalDate getEndDate() {
            return endDate;
        }

        public void setEndDate(
                java.time.LocalDate endDate) {

            this.endDate = endDate;
        }

        public Double getEstimatedAmount() {
            return estimatedAmount;
        }

        public void setEstimatedAmount(
                Double estimatedAmount) {

            this.estimatedAmount = estimatedAmount;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    public static class EquipmentRequest {

        private Long id;

        public EquipmentRequest() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }
    }
}