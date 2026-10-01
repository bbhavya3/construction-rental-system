package com.construction.equipment.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.construction.equipment.dto.UserResponse;
import com.construction.equipment.entity.User;
import com.construction.equipment.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserResponse registerUser(@Valid @RequestBody User user) {

        User savedUser = userService.registerUser(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    @PostMapping("/login")
    public UserResponse loginUser(@RequestBody User user) {

        User loggedInUser = userService.loginUser(
                user.getEmail(),
                user.getPassword()
        );

        return new UserResponse(
                loggedInUser.getId(),
                loggedInUser.getName(),
                loggedInUser.getEmail(),
                loggedInUser.getRole()
        );
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userService.getAllUsers()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                ))
                .toList();
    }
}