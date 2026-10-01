package com.construction.equipment.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.construction.equipment.entity.Rental;
import com.construction.equipment.service.RentalService;

@RestController
@RequestMapping("/api/rentals")
@CrossOrigin(origins = "http://localhost:5173")
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @PostMapping
    public Rental addRental(@Valid @RequestBody Rental rental) {
        return rentalService.addRental(rental);
    }

    @GetMapping
    public List<Rental> getAllRentals() {
        return rentalService.getAllRentals();
    }

    @GetMapping("/{id}")
    public Rental getRentalById(@PathVariable Long id) {
        return rentalService.getRentalById(id);
    }

    @GetMapping("/availability")
    public boolean checkAvailability(
            @RequestParam Long equipmentId,
            @RequestParam String startDate,
            @RequestParam String endDate) {

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        return rentalService.isEquipmentAvailable(
                equipmentId,
                start,
                end);
    }

    @PutMapping("/{id}")
    public Rental updateRental(
            @PathVariable Long id,
            @RequestBody Rental rental) {

        return rentalService.updateRental(id, rental);
    }

    @DeleteMapping("/{id}")
    public String deleteRental(@PathVariable Long id) {

        rentalService.deleteRental(id);

        return "Rental deleted successfully";
    }
}