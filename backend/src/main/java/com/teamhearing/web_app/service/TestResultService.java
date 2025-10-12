package com.teamhearing.web_app.service;

import com.teamhearing.web_app.controller.dto.TestResultDTO;
import com.teamhearing.web_app.entity.TestResult;
import com.teamhearing.web_app.repository.TestResultRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TestResultService {
    
    @Autowired
    private TestResultRepository testResultRepository;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public TestResult saveTestResult(TestResultDTO testResultDTO) {
        System.out.println("Saving test: " + testResultDTO.getTestType());
        try {
            String wrongAnswersJson = objectMapper.writeValueAsString(testResultDTO.getWrongAnswers());
            
            TestResult testResult = new TestResult(
                testResultDTO.getTestType(),
                testResultDTO.getUserId(),
                testResultDTO.getSubuser(),
                testResultDTO.getGap(),
                wrongAnswersJson
            );
            
            return testResultRepository.save(testResult);
        } catch (Exception e) {
            throw new RuntimeException("Error saving test result", e);
        }
    }
    
    public List<TestResult> getUserTestHistory(Long userId) {
        return testResultRepository.findByUserId(userId);
    }
}