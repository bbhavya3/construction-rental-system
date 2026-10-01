package com.construction.equipment.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.construction.equipment.entity.Rental;
import com.construction.equipment.repository.RentalRepository;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;

    public RentalService(RentalRepository rentalRepository) {
        this.rentalRepository = rentalRepository;
    }

    public Rental addRental(Rental rental) {

        validateDates(rental.getStartDate(), rental.getEndDate());

        return rentalRepository.save(rental);
    }

    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

    public Rental getRentalById(Long id) {
        return rentalRepository.findById(id).orElse(null);
    }

    public Rental updateRental(Long id, Rental rental) {

        validateDates(rental.getStartDate(), rental.getEndDate());

        Rental existingRental = rentalRepository.findById(id).orElse(null);

        if (existingRental != null) {

            existingRental.setEquipment(rental.getEquipment());
            existingRental.setCustomerName(rental.getCustomerName());
            existingRental.setStartDate(rental.getStartDate());
            existingRental.setEndDate(rental.getEndDate());
            existingRental.setTotalAmount(rental.getTotalAmount());
            existingRental.setStatus(rental.getStatus());

            return rentalRepository.save(existingRental);
        }

        return null;
    }

    public void deleteRental(Long id) {
        rentalRepository.deleteById(id);
    }

    public boolean isEquipmentAvailable(
            Long equipmentId,
            LocalDate startDate,
            LocalDate endDate) {

        validateDates(startDate, endDate);

        List<Rental> overlappingRentals =
                rentalRepository
                        .findByEquipmentIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                                equipmentId,
                                endDate,
                                startDate);

        return overlappingRentals.isEmpty();
    }

    private void validateDates(
            LocalDate startDate,
            LocalDate endDate) {

        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException(
                    "Start date and end date are required");
        }

        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException(
                    "End date cannot be before start date");
        }
    }
}