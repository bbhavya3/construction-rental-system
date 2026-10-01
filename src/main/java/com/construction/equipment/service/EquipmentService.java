package com.construction.equipment.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.construction.equipment.entity.Equipment;
import com.construction.equipment.repository.EquipmentRepository;

@Service
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;

    public EquipmentService(EquipmentRepository equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }

    public Equipment addEquipment(Equipment equipment) {
        return equipmentRepository.save(equipment);
    }

    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }

    public Equipment getEquipmentById(Long id) {
        return equipmentRepository.findById(id).orElse(null);
    }

    public Equipment updateEquipment(Long id, Equipment equipment) {

        Equipment existingEquipment = equipmentRepository.findById(id).orElse(null);

        if (existingEquipment != null) {
            existingEquipment.setName(equipment.getName());
            existingEquipment.setCategory(equipment.getCategory());
            existingEquipment.setDescription(equipment.getDescription());
            existingEquipment.setPricePerDay(equipment.getPricePerDay());
            existingEquipment.setLocation(equipment.getLocation());
            existingEquipment.setStatus(equipment.getStatus());

            return equipmentRepository.save(existingEquipment);
        }

        return null;
    }

    public void deleteEquipment(Long id) {
        equipmentRepository.deleteById(id);
    }

    public List<Equipment> searchByCategory(String category) {
        return equipmentRepository.findByCategory(category);
    }

    public List<Equipment> searchByLocation(String location) {
        return equipmentRepository.findByLocation(location);
    }

    public List<Equipment> searchByStatus(String status) {
        return equipmentRepository.findByStatus(status);
    }
}