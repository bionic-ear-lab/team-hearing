package com.teamhearing.web_app.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.teamhearing.web_app.entity.User;
import com.teamhearing.web_app.repository.UserRepository;

@Service
public class UserService {
  @Autowired
  private UserRepository userRepo;

  @Autowired
  private PasswordEncoder passwordEncoder;

  public User signup(String username, String email, String password, String birthdate, String gender) {
    if (userRepo.existsByUsername(username)) {
      throw new RuntimeException("Username already exists, please choose a different username.");
    }
    if (userRepo.existsByEmail(email)) {
      throw new RuntimeException("This email is attached to an existing account.");
    }
    User user = new User();
    user.setUsername(username);
    user.setEmail(email);
    user.setPasswordHash(passwordEncoder.encode(password));
    user.setBirthdate(LocalDate.parse(birthdate));
    user.setGender(gender);

    int maxRetries = 5;
    for (int i = 0; i < maxRetries; i++) {
      try {
        return userRepo.save(user);
      } catch (DataIntegrityViolationException e) {
        if (i == maxRetries - 1) {
          throw new RuntimeException("Failed to generate unique ID after " + maxRetries + " attempts");
        }
        user.setId(null);
      }
    }
    throw new RuntimeException("Failed to create user.");
  }

  public User login(String username, String password) {
    User user = userRepo.findByUsername(username)
      .orElseThrow(() -> new RuntimeException("Username does not exist."));
    if (!passwordEncoder.matches(password, user.getPasswordHash())) {
      throw new RuntimeException("Incorrect password.");
    }
    return user;
  }

  public User findById(Long id) {
    return userRepo.findById(id).orElse(null);
  }
}
