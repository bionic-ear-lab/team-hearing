package com.teamhearing.web_app.controller.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class TestResultDTO {
    
    @JsonProperty("userId")
    private Long userId;
    
    @JsonProperty("testType")
    private String testType;
    
    @JsonProperty("subuser")
    private String subuser;
    
    @JsonProperty("gap")
    private Integer gap;
    
    @JsonProperty("wrongAnswers")
    private List<Integer> wrongAnswers;
    
    public TestResultDTO() {}
    
    public TestResultDTO(Long userId, String testType, String subuser, Integer gap, List<Integer> wrongAnswers) {
        this.userId = userId;
        this.testType = testType;
        this.subuser = subuser;
        this.gap = gap;
        this.wrongAnswers = wrongAnswers;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getTestType() {
        return testType;
    }
    
    public void setTestType(String testType) {
        this.testType = testType;
    }
    
    public String getSubuser() {
        return subuser;
    }
    
    public void setSubuser(String subuser) {
        this.subuser = subuser;
    }
    
    public Integer getGap() {
        return gap;
    }
    
    public void setGap(Integer gap) {
        this.gap = gap;
    }
    
    public List<Integer> getWrongAnswers() {
        return wrongAnswers;
    }
    
    public void setWrongAnswers(List<Integer> wrongAnswers) {
        this.wrongAnswers = wrongAnswers;
    }
}
