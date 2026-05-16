package com.voicecart.controller;

import com.voicecart.model.User;
import com.voicecart.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return userService.findByPhoneNumber(request.getPhoneNumber())
                .filter(user -> request.getPassword().equals(user.getPassword()))
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(new AuthResponse("Login successful", user)))
                .orElseGet(() -> ResponseEntity.status(401).body(new ErrorResponse("Invalid phone number or password")));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userService.findByPhoneNumber(request.getPhoneNumber()).isPresent()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Phone number already registered"));
        }
        
        User newUser = new User();
        newUser.setPhoneNumber(request.getPhoneNumber());
        newUser.setPassword(request.getPassword());
        newUser.setName(request.getName());
        newUser.setRole(User.Role.AGENT); // Defaulting to AGENT for this portal
        
        User savedUser = userService.createUser(newUser);
        return ResponseEntity.ok(new AuthResponse("Registration successful", savedUser));
    }

    public static class LoginRequest {
        private String phoneNumber;
        private String password;

        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String phoneNumber;
        private String password;
        private String name;

        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class AuthResponse {
        private String message;
        private User user;

        public AuthResponse(String message, User user) {
            this.message = message;
            this.user = user;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public User getUser() { return user; }
        public void setUser(User user) { this.user = user; }
    }

    public static class ErrorResponse {
        private String error;

        public ErrorResponse(String error) {
            this.error = error;
        }

        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
    }
}
