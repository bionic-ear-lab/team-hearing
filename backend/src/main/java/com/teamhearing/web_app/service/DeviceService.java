package com.teamhearing.web_app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teamhearing.web_app.entity.Device;
import com.teamhearing.web_app.repository.DeviceRepository;

@Service
public class DeviceService {
    @Autowired
    private DeviceRepository deviceRepository;

    public List<Device> getDevicesByUserId(Long userId) {
        return deviceRepository.findByUserId(userId);
    }

    @Transactional
    public List<Device> saveDevices(Long userId, List<Device> devices) {
        // delete existing devices for this user
        deviceRepository.deleteByUserId(userId);
        
        // set userId for all devices and save
        devices.forEach(device -> {
            device.setUserId(userId);
            device.setDeviceId(null);
        });
        return deviceRepository.saveAll(devices);
    }

    public void deleteDevice(Long deviceId) {
        deviceRepository.deleteById(deviceId);
    }
}