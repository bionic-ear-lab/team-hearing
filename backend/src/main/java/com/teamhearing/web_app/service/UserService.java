package com.teamhearing.web_app.service;

import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
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
    if (userRepo.existsByUsername(username) || userRepo.existsByEmail(email)) {
      throw new RuntimeException("Username or email already exists");
    }
    User user = new User();
    user.setUsername(username);
    user.setEmail(email);
    user.setPasswordHash(passwordEncoder.encode(password));
    user.setBirthdate(LocalDate.parse(birthdate));
    user.setGender(gender);
    return userRepo.save(user);
  }

  public User login(String username, String password) {
    User user = userRepo.findByUsername(username)
      .orElseThrow(() -> new RuntimeException("Invalid credentials"));
    if (!passwordEncoder.matches(password, user.getPasswordHash())) {
      throw new RuntimeException("Invalid credentials");
    }
    return user;
  }

  public User findById(Long id) {
    return userRepo.findById(id).orElse(null);
  }
}
