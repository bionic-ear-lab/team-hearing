package com.teamhearing.web_app.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
    public ResponseEntity<User> signup(@RequestBody Map<String, String> body) {
        System.out.println("Signup endpoint hit with data: " + body);
        User user = userService.signup(body.get("username"), body.get("email"), body.get("password"));
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody Map<String, String> body) {
        System.out.println("Login endpoint hit with data: " + body);
        User user = userService.login(body.get("username"), body.get("password"));
        return ResponseEntity.ok(user);
    }
}
