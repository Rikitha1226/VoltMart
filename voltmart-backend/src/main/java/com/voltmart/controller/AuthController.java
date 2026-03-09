package com.voltmart.controller;

import com.voltmart.entity.User;
import com.voltmart.repository.UserRepository;
import com.voltmart.service.UserService;

import java.util.Collections;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;

    public AuthController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    // STEP 1: REGISTER → SEND OTP
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {

            userService.registerUser(user);

            return ResponseEntity.ok(
                    Collections.singletonMap("message", "OTP sent to email"));

        } catch (Exception e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }

    // STEP 2: VERIFY OTP → SAVE USER
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String otp = request.get("otp");

        boolean verified = userService.verifyOtp(email, otp);

        if (verified) {
            return ResponseEntity.ok(
                    Collections.singletonMap("message", "Email verified successfully"));
        }

        return ResponseEntity.badRequest().body("Invalid OTP");
    }

    // LOGIN (only verified users allowed)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {

        User user = userRepository
                .findByUsername(loginUser.getUsername())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }

        if (!user.getPassword().equals(loginUser.getPassword())) {
            return ResponseEntity.status(401).body("Invalid password");
        }

        if (!user.isVerified()) {
            return ResponseEntity.status(403)
                    .body("Please verify your email before logging in");
        }

        return ResponseEntity.ok(user);
    }

}