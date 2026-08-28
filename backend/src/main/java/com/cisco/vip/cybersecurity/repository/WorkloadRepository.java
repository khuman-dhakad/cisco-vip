package com.cisco.vip.cybersecurity.repository;

import com.cisco.vip.cybersecurity.model.Workload;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkloadRepository extends MongoRepository<Workload, String> {
    Optional<Workload> findByCode(String code);
    List<Workload> findBySegmentId(String segmentId);
    List<Workload> findByEnvironment(String environment);
    List<Workload> findByIsCompromisedTrue();
    List<Workload> findByIsQuarantinedTrue();
}
