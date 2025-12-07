package com.teamhearing.web_app.controller.dto;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TestResultDTO {
    
    @JsonProperty("userId")
    private Long userId;
    
    @JsonProperty("testType")
    private String testType;
    
    @JsonProperty("subuser")
    private String subuser;
    
    @JsonProperty("gap")
    private BigDecimal gap;
    
    @JsonProperty("wrongAnswers")
    private List<Integer> wrongAnswers;

    @JsonProperty("note_range")
    private String note_range;
    
    public TestResultDTO() {}
    
    public TestResultDTO(Long userId, String testType, String subuser, BigDecimal gap, List<Integer> wrongAnswers, String note_range) {
        this.userId = userId;
        this.testType = testType;
        this.subuser = subuser;
        this.gap = gap;
        this.wrongAnswers = wrongAnswers;
        this.note_range = note_range;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getNoteRange() {
        return note_range;
    }
    
    public void setNoteRange(String note_range) {
        this.note_range = note_range;
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
    
    public BigDecimal getGap() {
        return gap;
    }
    
    public void setGap(BigDecimal gap) {
        this.gap = gap;
    }
    
    public List<Integer> getWrongAnswers() {
        return wrongAnswers;
    }
    
    public void setWrongAnswers(List<Integer> wrongAnswers) {
        this.wrongAnswers = wrongAnswers;
    }
}
