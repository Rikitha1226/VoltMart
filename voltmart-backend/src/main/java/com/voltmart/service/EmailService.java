package com.voltmart.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@voltmart.com");
        message.setTo(toEmail);
        message.setSubject("VoltMart - Your Verification OTP");
        message.setText(
                "Welcome to VoltMart! Your account verification code is: "
                        + otp
                        + "\n\nThis code will expire in 10 minutes.");

        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("Failed to send async verification email: " + e.getMessage());
        }
    }
}
