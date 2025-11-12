package com.teamhearing.web_app.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teamhearing.web_app.entity.Device;
import com.teamhearing.web_app.service.DeviceService;

@RestController
@RequestMapping("/api/devices")
@CrossOrigin(origins = "*")
public class DeviceController {
    @Autowired
    private DeviceService deviceService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getDevices(@PathVariable Long userId) {
        try {
            List<Device> devices = deviceService.getDevicesByUserId(userId);
            return ResponseEntity.ok(devices);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to fetch devices"));
        }
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> saveDevices(
            @PathVariable Long userId, 
            @RequestBody List<Device> devices) {
        try {
            List<Device> saved = deviceService.saveDevices(userId, devices);
            return ResponseEntity.ok(Map.of(
                "message", "Devices saved successfully",
                "devices", saved
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to save devices: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{deviceId}")
    public ResponseEntity<?> deleteDevice(@PathVariable Long deviceId) {
        try {
            deviceService.deleteDevice(deviceId);
            return ResponseEntity.ok(Map.of("message", "Device deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to delete device"));
        }
    }
}
