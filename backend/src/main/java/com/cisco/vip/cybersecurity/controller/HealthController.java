package com.cisco.vip.cybersecurity.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> map = new HashMap<>();
        map.put("status", "UP");
        map.put("service", "Cisco VIP Cyber Security Operations Platform");
        map.put("student", "KHUMAN DHAKAD");
        map.put("institution", "Lakshmi Narain College of Technology (LNCT), Bhopal");
        map.put("track", "Cyber Security");
        map.put("program", "Cisco Virtual Internship Program 2026");
        map.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(map);
    }
}
