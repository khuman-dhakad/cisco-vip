package com.cisco.vip.cybersecurity.repository;

import com.cisco.vip.cybersecurity.model.Incident;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends MongoRepository<Incident, String> {
    List<Incident> findAllByOrderByTimestampDesc();
    List<Incident> findByStatus(String status);
    List<Incident> findBySeverity(String severity);
    long countByStatusNot(String status);
}
