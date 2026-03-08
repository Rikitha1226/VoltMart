package com.voltmart.service;

import com.voltmart.entity.User;
import com.voltmart.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {


private final UserRepository userRepository;

public UserService(UserRepository userRepository){
    this.userRepository = userRepository;
}

public User registerUser(User user){

    if(userRepository.findByUsername(user.getUsername()).isPresent()){
        throw new IllegalArgumentException("Username already exists");
    }

    if(userRepository.findByEmail(user.getEmail()).isPresent()){
        throw new IllegalArgumentException("Email already exists");
    }

    return userRepository.save(user);
}

public User updateProfile(Long id, User updatedUser){

    User user = userRepository.findById(id).orElse(null);

    if(user != null){
        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        user.setPhone(updatedUser.getPhone());
        user.setPassword(updatedUser.getPassword());

        return userRepository.save(user);
    }

    return null;
}

public void deleteUser(Long id){


if(!userRepository.existsById(id)){
    throw new RuntimeException("User not found");
}

userRepository.deleteById(id);

}



}
