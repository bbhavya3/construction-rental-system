package com.construction.equipment.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.construction.equipment.entity.Booking;
import com.construction.equipment.repository.BookingRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Booking addBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public Booking updateBooking(Long id, Booking booking) {

        Booking existingBooking = bookingRepository.findById(id).orElse(null);

        if (existingBooking != null) {
            existingBooking.setEquipment(booking.getEquipment());
            existingBooking.setStartDate(booking.getStartDate());
            existingBooking.setEndDate(booking.getEndDate());
            existingBooking.setEstimatedAmount(booking.getEstimatedAmount());
            existingBooking.setStatus(booking.getStatus());

            return bookingRepository.save(existingBooking);
        }

        return null;
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}