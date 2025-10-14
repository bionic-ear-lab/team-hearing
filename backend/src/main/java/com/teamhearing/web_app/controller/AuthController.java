package com.teamhearing.web_app.controller;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.teamhearing.web_app.entity.User;
import com.teamhearing.web_app.service.UserService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
  @Autowired
  private UserService userService;

  @PostMapping("/signup")
  public ResponseEntity<Map<String, Object>> signup(@RequestBody Map<String, String> body) {
    System.out.println("Signup endpoint hit with data: " + body);
    User user = userService.signup(
        body.get("username"),
        body.get("email"),
        body.get("password"),
        body.get("birthdate"),
        body.get("gender"));
    return ResponseEntity.ok(userToMap(user));
  }

  @PostMapping("/login")
  public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
    System.out.println("Login endpoint hit with data: " + body);
    User user = userService.login(body.get("username"), body.get("password"));
    return ResponseEntity.ok(userToMap(user));
  }

  @PostMapping("/validate")
  public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String authHeader) {
    try {
      if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        return ResponseEntity.status(401).build();
      }
      String userId = authHeader.substring("Bearer ".length()).trim();
      User user = userService.findById(Long.parseLong(userId));
      if (user == null) {
        return ResponseEntity.status(401).build();
      }
      return ResponseEntity.ok(userToMap(user));
    } catch (Exception e) {
      return ResponseEntity.status(401).build();
    }
  }

  private Map<String, Object> userToMap(User user) {
    Map<String, Object> response = new HashMap<>();
    response.put("id", user.getId());
    response.put("username", user.getUsername());
    response.put("email", user.getEmail());
    response.put("birthdate", user.getBirthdate());
    response.put("gender", user.getGender());
    return response;
  }
}