package com.cisco.vip.cybersecurity.repository;

import com.cisco.vip.cybersecurity.model.HybridLinkState;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HybridLinkRepository extends MongoRepository<HybridLinkState, String> {
}
