

package com.teamhearing.web_app.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teamhearing.web_app.entity.User;
import com.teamhearing.web_app.repository.UserRepository;
import com.teamhearing.web_app.util.JwtUtil;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            System.out.println("Authorization header received: '" + authHeader + "'");
            
            if (authHeader == null || authHeader.isEmpty()) {
                System.out.println("No authorization header provided");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No authentication token provided"));
            }
            
            String token = authHeader.trim();
            if (token.startsWith("Bearer ")) {
                token = token.substring(7).trim();
            }
            
            System.out.println("Extracting user ID from JWT token");
            Long userId = jwtUtil.extractUserId(token);
            
            if (userId == null) {
                System.out.println("No user ID found in token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid token"));
            }
            
            System.out.println("Fetching user with ID: " + userId);
            
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                System.out.println("User not found with ID: " + userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
            }
            
            User user = userOpt.get();
            System.out.println("Found user: " + user.getUsername());
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getUsername() != null ? user.getUsername() : "");
            response.put("codename", "");
            response.put("email", user.getEmail() != null ? user.getEmail() : "");
            response.put("birthdate", user.getBirthdate() != null ? user.getBirthdate().toString() : "");
            response.put("gender", user.getGender() != null ? user.getGender() : "");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error fetching user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error fetching user: " + e.getMessage()));
        }
    }
    
    @PutMapping("/update")
    public ResponseEntity<?> updateUser(
            @RequestBody Map<String, Object> req,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            System.out.println("Update request received: " + req);
            
            if (authHeader == null || authHeader.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No authentication token provided"));
            }
            
            String token = authHeader.trim();
            if (token.startsWith("Bearer ")) {
                token = token.substring(7).trim();
            }
            
            System.out.println("Extracting user ID from JWT token");
            Long userId = jwtUtil.extractUserId(token);
            
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid token"));
            }
            
            System.out.println("Looking for user with ID: " + userId);
            
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found with ID: " + userId));
            }
            
            User user = userOpt.get();
            System.out.println("Found user: " + user.getUsername());
            
            if (req.containsKey("name")) {
                String name = req.get("name").toString();
                System.out.println("Updating username to: " + name);
                user.setUsername(name);
            }
            
            if (req.containsKey("email")) {
                String email = req.get("email").toString();
                System.out.println("Updating email to: " + email);
                user.setEmail(email);
            }
            
            if (req.containsKey("birthdate")) {
                String dateStr = req.get("birthdate").toString();
                if (!dateStr.isEmpty()) {
                    System.out.println("Updating birthdate to: " + dateStr);
                    user.setBirthdate(LocalDate.parse(dateStr));
                }
            }
            
            if (req.containsKey("gender")) {
                String gender = req.get("gender").toString();
                System.out.println("Updating gender to: " + gender);
                user.setGender(gender);
            }
            
            System.out.println("Saving user...");
            userRepository.save(user);
            System.out.println("User saved successfully");
            
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
            
        } catch (Exception e) {
            System.err.println("Error updating user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error updating user: " + e.getMessage()));
        }
    }
}