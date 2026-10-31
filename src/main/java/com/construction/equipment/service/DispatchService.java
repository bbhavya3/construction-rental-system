
package com.construction.equipment.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.construction.equipment.entity.Booking;
import com.construction.equipment.entity.Dispatch;
import com.construction.equipment.repository.BookingRepository;
import com.construction.equipment.repository.DispatchRepository;

@Service
public class DispatchService {

    private final DispatchRepository dispatchRepository;
    private final BookingRepository bookingRepository;

    public DispatchService(
            DispatchRepository dispatchRepository,
            BookingRepository bookingRepository) {
        this.dispatchRepository = dispatchRepository;
        this.bookingRepository = bookingRepository;
    }

    public Dispatch createDispatch(Dispatch dispatch) {

        if (dispatch.getBooking() == null
                || dispatch.getBooking().getId() == null) {
            throw new IllegalArgumentException("Booking ID is required");
        }

        Booking booking = bookingRepository
                .findById(dispatch.getBooking().getId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Booking not found"));

        if (booking.getEquipment() == null) {
            throw new IllegalArgumentException(
                    "Equipment is not linked to this booking");
        }

        if (dispatch.getScheduledDate() == null) {
            throw new IllegalArgumentException("Scheduled date is required");
        }

        if (booking.getStartDate() != null
                && dispatch.getScheduledDate().isBefore(booking.getStartDate())) {
            throw new IllegalArgumentException(
                    "Dispatch date cannot be before booking start date");
        }

        dispatch.setBooking(booking);
        dispatch.setEquipment(booking.getEquipment());

        if (dispatch.getStatus() == null
                || dispatch.getStatus().isBlank()) {
            dispatch.setStatus("PENDING");
        }

        if (dispatch.getAssignedTo() == null
                || dispatch.getAssignedTo().isBlank()) {
            dispatch.setAssignedTo("Admin");
        }

        if (dispatch.getDestination() == null
                || dispatch.getDestination().isBlank()) {
            dispatch.setDestination(dispatch.getDeliveryAddress());
        }

        if (dispatch.getDispatchDate() == null) {
            dispatch.setDispatchDate(dispatch.getScheduledDate());
        }

        return dispatchRepository.save(dispatch);
    }

    public List<Dispatch> getAllDispatches() {
        return dispatchRepository.findAll();
    }

    public Dispatch getDispatchById(Long id) {
        return dispatchRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Dispatch not found"));
    }

    public Dispatch updateDispatch(Long id, Dispatch updatedDispatch) {

        Dispatch existing = getDispatchById(id);

        if (updatedDispatch.getDriverName() != null) {
            existing.setDriverName(updatedDispatch.getDriverName());
        }

        if (updatedDispatch.getVehicleNumber() != null) {
            existing.setVehicleNumber(updatedDispatch.getVehicleNumber());
        }

        if (updatedDispatch.getDeliveryAddress() != null) {
            existing.setDeliveryAddress(
                    updatedDispatch.getDeliveryAddress());

            if (updatedDispatch.getDestination() == null
                    || updatedDispatch.getDestination().isBlank()) {
                existing.setDestination(
                        updatedDispatch.getDeliveryAddress());
            }
        }

        if (updatedDispatch.getDestination() != null
                && !updatedDispatch.getDestination().isBlank()) {
            existing.setDestination(updatedDispatch.getDestination());
        }

        if (updatedDispatch.getStatus() != null
                && !updatedDispatch.getStatus().isBlank()) {
            existing.setStatus(updatedDispatch.getStatus());
        }

        if (updatedDispatch.getAssignedTo() != null
                && !updatedDispatch.getAssignedTo().isBlank()) {
            existing.setAssignedTo(updatedDispatch.getAssignedTo());
        }

        if (updatedDispatch.getScheduledDate() != null) {
            existing.setScheduledDate(updatedDispatch.getScheduledDate());
        }

        if (updatedDispatch.getDispatchDate() != null) {
            existing.setDispatchDate(updatedDispatch.getDispatchDate());
        }

        return dispatchRepository.save(existing);
    }

    public void deleteDispatch(Long id) {
        if (!dispatchRepository.existsById(id)) {
            throw new IllegalArgumentException("Dispatch not found");
        }

        dispatchRepository.deleteById(id);
    }
}
