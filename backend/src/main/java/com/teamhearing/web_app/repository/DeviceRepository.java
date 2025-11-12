package com.teamhearing.web_app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teamhearing.web_app.entity.Device;

public interface DeviceRepository extends JpaRepository<Device, Long> {
    List<Device> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}