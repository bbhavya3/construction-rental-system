
package com.construction.equipment.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.construction.equipment.dto.UserResponse;
import com.construction.equipment.entity.User;
import com.construction.equipment.service.UserService;
import com.construction.equipment.security.JwtService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(
            UserService userService,
            JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public UserResponse registerUser(
            @Valid @RequestBody User user) {

        User savedUser = userService.registerUser(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    @PostMapping("/login")
    public Map<String, Object> loginUser(
            @RequestBody User user) {

        User loggedInUser = userService.loginUser(
                user.getEmail(),
                user.getPassword()
        );

        String token = jwtService.generateToken(
                loggedInUser.getEmail()
        );

        return Map.of(
                "id", loggedInUser.getId(),
                "name", loggedInUser.getName(),
                "email", loggedInUser.getEmail(),
                "role", loggedInUser.getRole(),
                "token", token
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
