package com.cisco.vip.cybersecurity.repository;

import com.cisco.vip.cybersecurity.model.SecurityEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecurityEventRepository extends MongoRepository<SecurityEvent, String> {
    List<SecurityEvent> findTop100ByOrderByTimestampDesc();
    List<SecurityEvent> findBySeverity(String severity);
    List<SecurityEvent> findByEventType(String eventType);
    long countByResult(String result);
}
