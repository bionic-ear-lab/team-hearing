package com.teamhearing.web_app.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tests")
public class TestResult {
    
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String testType;
    
    @Column(nullable = false)
    private Long userId;
    
    private String subuser;
    
    private Integer gap;
    
    @Column(columnDefinition = "JSON")
    private String wrongAnswers;
    
    public TestResult() {}
    
    public TestResult(String testType, Long userId, Integer gap, String wrongAnswers) {
        this.testType = testType;
        this.userId = userId;
        this.subuser = null;
        this.gap = gap;
        this.wrongAnswers = wrongAnswers;
    }

    public TestResult(String testType, Long userId, String subuser, Integer gap, String wrongAnswers) {
        this.testType = testType;
        this.userId = userId;
        this.subuser = subuser;
        this.gap = gap;
        this.wrongAnswers = wrongAnswers;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTestType() {
        return testType;
    }
    
    public void setTestType(String testType) {
        this.testType = testType;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
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
    
    public String getWrongAnswers() {
        return wrongAnswers;
    }
    
    public void setWrongAnswers(String wrongAnswers) {
        this.wrongAnswers = wrongAnswers;
    }
}
