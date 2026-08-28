package com.cisco.vip.cybersecurity.repository;

import com.cisco.vip.cybersecurity.model.NetworkSegment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NetworkSegmentRepository extends MongoRepository<NetworkSegment, String> {
    List<NetworkSegment> findByEnvironment(String environment);
    List<NetworkSegment> findByVpcId(String vpcId);
}
