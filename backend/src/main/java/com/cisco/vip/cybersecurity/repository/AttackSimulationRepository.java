package com.cisco.vip.cybersecurity.repository;

import com.cisco.vip.cybersecurity.model.AttackSimulation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttackSimulationRepository extends MongoRepository<AttackSimulation, String> {
    List<AttackSimulation> findTop20ByOrderByTimestampDesc();
}
