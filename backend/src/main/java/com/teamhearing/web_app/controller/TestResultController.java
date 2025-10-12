package com.teamhearing.web_app.controller;

import com.teamhearing.web_app.controller.dto.TestResultDTO;
import com.teamhearing.web_app.entity.TestResult;
import com.teamhearing.web_app.service.TestResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tests")
@CrossOrigin(origins = "http://localhost:5173")
public class TestResultController {
    
    @Autowired
    private TestResultService testResultService;
    
    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveTestResult(@RequestBody TestResultDTO testResultDTO) {
        try {
            if (testResultDTO.getUserId() == null || testResultDTO.getTestType() == null || testResultDTO.getGap() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Missing required fields: userId, testType, gap"));
            }
            
            TestResult savedTest = testResultService.saveTestResult(testResultDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Test result saved successfully");
            response.put("testId", savedTest.getId());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to save test result", "details", e.getMessage()));
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<Object> getUserTestHistory(@PathVariable Long userId) {
        try {
            List<TestResult> tests = testResultService.getUserTestHistory(userId);
            return ResponseEntity.status(HttpStatus.OK).body(tests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch test history", "details", e.getMessage()));
        }
    }
}