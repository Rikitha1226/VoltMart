package com.voltmart.controller;


import com.voltmart.entity.User;
import com.voltmart.repository.UserRepository;
import com.voltmart.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {


private final UserService userService;
private final UserRepository userRepository;

public AuthController(UserService userService,
                      UserRepository userRepository){
    this.userService = userService;
    this.userRepository = userRepository;
}

@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody User user){

    try{
        User newUser = userService.registerUser(user);
        return ResponseEntity.ok(newUser);
    }
    catch(Exception e){
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody User loginUser){

    User user = userRepository
            .findByUsername(loginUser.getUsername())
            .orElse(null);

    if(user == null){
        return ResponseEntity.status(401).body("User not found");
    }

    if(!user.getPassword().equals(loginUser.getPassword())){
        return ResponseEntity.status(401).body("Invalid password");
    }

    return ResponseEntity.ok(user);
}

}