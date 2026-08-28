package com.cisco.vip.cybersecurity.repository;

import com.cisco.vip.cybersecurity.model.SecurityPolicy;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecurityPolicyRepository extends MongoRepository<SecurityPolicy, String> {
    List<SecurityPolicy> findByEnabledTrueOrderByPriorityAsc();
    List<SecurityPolicy> findAllByOrderByPriorityAsc();
    List<SecurityPolicy> findByScope(String scope);
    List<SecurityPolicy> findByAction(String action);
}
