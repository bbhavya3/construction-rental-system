package com.construction.equipment.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.construction.equipment.entity.Dispatch;
import com.construction.equipment.service.DispatchService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/dispatches")
@CrossOrigin(origins = "http://localhost:5173")
public class DispatchController {

    private final DispatchService dispatchService;

    public DispatchController(DispatchService dispatchService) {
        this.dispatchService = dispatchService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Dispatch createDispatch(@RequestBody Dispatch dispatch) {
        return dispatchService.createDispatch(dispatch);
    }

    @GetMapping
    public List<Dispatch> getAllDispatches() {
        return dispatchService.getAllDispatches();
    }

    @GetMapping("/{id}")
    public Dispatch getDispatchById(@PathVariable Long id) {
        return dispatchService.getDispatchById(id);
    }

    @PutMapping("/{id}")
    public Dispatch updateDispatch(
            @PathVariable Long id,
            @RequestBody Dispatch dispatch) {
        return dispatchService.updateDispatch(id, dispatch);
    }

    @DeleteMapping("/{id}")
    public String deleteDispatch(@PathVariable Long id) {
        dispatchService.deleteDispatch(id);
        return "Dispatch deleted successfully";
    }
}