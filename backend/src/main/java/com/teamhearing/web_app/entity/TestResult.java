package com.teamhearing.web_app.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

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
    
    @Column(name = "gap", precision = 5, scale = 3)
    private BigDecimal gap;
    
    @Column(columnDefinition = "JSON")
    private String wrongAnswers;

    @Column(name = "time_logged")
    private LocalDateTime timeLogged;

    private String note_range;
    
    public TestResult() {}
    
    public TestResult(String testType, Long userId, BigDecimal gap, String wrongAnswers, String note_range) {
        this.testType = testType;
        this.userId = userId;
        this.subuser = null;
        this.gap = gap;
        this.wrongAnswers = wrongAnswers;
        this.timeLogged = LocalDateTime.now();
        this.note_range = note_range;
    }

    public TestResult(String testType, Long userId, String subuser, BigDecimal gap, String wrongAnswers, String note_range) {
        this.testType = testType;
        this.userId = userId;
        this.subuser = subuser;
        this.gap = gap;
        this.wrongAnswers = wrongAnswers;
        this.timeLogged = LocalDateTime.now();
        this.note_range = note_range;
    }

    @PrePersist
    protected void onCreate() {
        if (timeLogged == null) {
            timeLogged = LocalDateTime.now();
        }
    }

    public LocalDateTime getTimeLogged() {
        return timeLogged;
    }
    
    public void setTimeLogged(LocalDateTime timeLogged) {
        this.timeLogged = timeLogged;
    }

    public String getNoteRange() {
        return note_range;
    }
    
    public void setNoteRange(String note_range) {
        this.note_range = note_range;
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
    
    public BigDecimal getGap() {
        return gap;
    }
    
    public void setGap(BigDecimal gap) {
        this.gap = gap;
    }
    
    public String getWrongAnswers() {
        return wrongAnswers;
    }
    
    public void setWrongAnswers(String wrongAnswers) {
        this.wrongAnswers = wrongAnswers;
    }
}
