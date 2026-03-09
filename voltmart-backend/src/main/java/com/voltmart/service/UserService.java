package com.voltmart.service;

import com.voltmart.entity.User;
import com.voltmart.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    // temporary storage until OTP verified
    private final Map<String, User> tempUsers = new HashMap<>();
    private final Map<String, String> otpStorage = new HashMap<>();

    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // STEP 1: SEND OTP (do NOT save user)
    public void registerUser(User user) {

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        String otp = String.format("%06d", new Random().nextInt(999999));

        otpStorage.put(user.getEmail(), otp);
        tempUsers.put(user.getEmail(), user);

        System.out.println("OTP for " + user.getEmail() + " : " + otp);

        emailService.sendOtpEmail(user.getEmail(), otp);
    }

    // STEP 2: VERIFY OTP AND SAVE USER
    public boolean verifyOtp(String email, String otp) {

        String storedOtp = otpStorage.get(email);

        if (storedOtp == null || !storedOtp.equals(otp)) {
            throw new IllegalArgumentException("Invalid OTP");
        }

        User user = tempUsers.get(email);

        user.setVerified(true);

        userRepository.save(user);

        otpStorage.remove(email);
        tempUsers.remove(email);

        return true;
    }

    // UPDATE PROFILE
    public User updateProfile(Long id, User updatedUser) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        user.setPhone(updatedUser.getPhone());
        user.setPassword(updatedUser.getPassword());

        return userRepository.save(user);
    }

    // DELETE USER
    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }

        userRepository.deleteById(id);
    }
}