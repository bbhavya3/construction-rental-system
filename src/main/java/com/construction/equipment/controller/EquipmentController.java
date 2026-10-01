package com.construction.equipment.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.construction.equipment.entity.Equipment;
import com.construction.equipment.service.EquipmentService;

@RestController
@RequestMapping("/api/equipment")
@CrossOrigin(origins = "http://localhost:5173")
public class EquipmentController {

    private final EquipmentService equipmentService;

    public EquipmentController(EquipmentService equipmentService) {
        this.equipmentService = equipmentService;
    }

    @PostMapping
    public Equipment addEquipment(@Valid @RequestBody Equipment equipment) {
        return equipmentService.addEquipment(equipment);
    }

    @GetMapping
    public List<Equipment> getAllEquipment() {
        return equipmentService.getAllEquipment();
    }

    @GetMapping("/{id}")
    public Equipment getEquipmentById(@PathVariable Long id) {
        return equipmentService.getEquipmentById(id);
    }

    @GetMapping("/search/category")
    public List<Equipment> searchByCategory(@RequestParam String category) {
        return equipmentService.searchByCategory(category);
    }

    @GetMapping("/search/location")
    public List<Equipment> searchByLocation(@RequestParam String location) {
        return equipmentService.searchByLocation(location);
    }

    @GetMapping("/search/status")
    public List<Equipment> searchByStatus(@RequestParam String status) {
        return equipmentService.searchByStatus(status);
    }

    @PutMapping("/{id}")
    public Equipment updateEquipment(
            @PathVariable Long id,
            @RequestBody Equipment equipment) {
        return equipmentService.updateEquipment(id, equipment);
    }

    @DeleteMapping("/{id}")
    public String deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        return "Equipment deleted successfully";
    }
}