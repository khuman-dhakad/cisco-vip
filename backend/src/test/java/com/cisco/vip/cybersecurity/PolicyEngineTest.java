package com.cisco.vip.cybersecurity;

import com.cisco.vip.cybersecurity.dto.PolicyEvaluationRequest;
import com.cisco.vip.cybersecurity.dto.PolicyEvaluationResponse;
import com.cisco.vip.cybersecurity.model.SecurityPolicy;
import com.cisco.vip.cybersecurity.repository.SecurityPolicyRepository;
import com.cisco.vip.cybersecurity.service.PolicyEngineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PolicyEngineTest {

    @Mock
    private SecurityPolicyRepository policyRepository;

    private PolicyEngineService policyEngineService;

    @BeforeEach
    void setUp() {
        policyEngineService = new PolicyEngineService(policyRepository);

        SecurityPolicy allowFaculty = new SecurityPolicy("ALLOW Faculty -> Academic Portal", "ROLE:FACULTY", "WORKLOAD:APP_A", "TCP", "443", "ALLOW", 100, "Allow faculty", true, "GATEWAY", "IAM");
        allowFaculty.setId("P1");

        SecurityPolicy denyLateral = new SecurityPolicy("DENY App A -> App B", "WORKLOAD:APP_A", "WORKLOAD:APP_B", "ANY", "ANY", "DENY", 120, "Block lateral", true, "DC", "ZERO_TRUST");
        denyLateral.setId("P2");

        SecurityPolicy allowDbQuery = new SecurityPolicy("ALLOW App A -> DB", "WORKLOAD:APP_A", "WORKLOAD:DB_CORE", "TCP", "5432", "ALLOW", 130, "Allow SQL", true, "DC", "MICROSEGMENTATION");
        allowDbQuery.setId("P3");

        SecurityPolicy denyDbSsh = new SecurityPolicy("DENY App A -> DB SSH", "WORKLOAD:APP_A", "WORKLOAD:DB_CORE", "TCP", "22", "DENY", 125, "Block DB SSH", true, "DC", "ZERO_TRUST");
        denyDbSsh.setId("P4");

        when(policyRepository.findByEnabledTrueOrderByPriorityAsc()).thenReturn(
                Arrays.asList(allowFaculty, denyLateral, denyDbSsh, allowDbQuery)
        );
    }

    @Test
    @DisplayName("Should evaluate ALLOW for Faculty accessing Academic Portal")
    void testFacultyAccessAllowed() {
        PolicyEvaluationRequest req = new PolicyEvaluationRequest("ROLE:FACULTY", "WORKLOAD:APP_A", "TCP", "443", "FACULTY");
        PolicyEvaluationResponse resp = policyEngineService.evaluateTraffic(req);

        assertTrue(resp.isAllowed());
        assertEquals("ALLOW", resp.getVerdict());
        assertEquals("P1", resp.getMatchedPolicyId());
    }

    @Test
    @DisplayName("Should evaluate DENY for lateral movement from App A to App B")
    void testLateralMovementDenied() {
        PolicyEvaluationRequest req = new PolicyEvaluationRequest("WORKLOAD:APP_A", "WORKLOAD:APP_B", "TCP", "8080", null);
        PolicyEvaluationResponse resp = policyEngineService.evaluateTraffic(req);

        assertFalse(resp.isAllowed());
        assertEquals("DENY", resp.getVerdict());
        assertEquals("P2", resp.getMatchedPolicyId());
    }

    @Test
    @DisplayName("Should evaluate DENY for unauthorized SSH port 22 access from App A to DB")
    void testUnauthorizedSshDenied() {
        PolicyEvaluationRequest req = new PolicyEvaluationRequest("WORKLOAD:APP_A", "WORKLOAD:DB_CORE", "TCP", "22", null);
        PolicyEvaluationResponse resp = policyEngineService.evaluateTraffic(req);

        assertFalse(resp.isAllowed());
        assertEquals("DENY", resp.getVerdict());
        assertEquals("P4", resp.getMatchedPolicyId());
    }

    @Test
    @DisplayName("Should evaluate ALLOW for authorized SQL port 5432 query from App A to DB")
    void testAuthorizedSqlQueryAllowed() {
        PolicyEvaluationRequest req = new PolicyEvaluationRequest("WORKLOAD:APP_A", "WORKLOAD:DB_CORE", "TCP", "5432", null);
        PolicyEvaluationResponse resp = policyEngineService.evaluateTraffic(req);

        assertTrue(resp.isAllowed());
        assertEquals("ALLOW", resp.getVerdict());
        assertEquals("P3", resp.getMatchedPolicyId());
    }

    @Test
    @DisplayName("Should enforce Zero-Trust Implicit Default Deny when no rules match")
    void testImplicitDefaultDeny() {
        PolicyEvaluationRequest req = new PolicyEvaluationRequest("192.168.99.1", "10.10.30.99", "UDP", "9999", null);
        PolicyEvaluationResponse resp = policyEngineService.evaluateTraffic(req);

        assertFalse(resp.isAllowed());
        assertEquals("DENY", resp.getVerdict());
        assertEquals("DEFAULT_IMPLICIT_DENY", resp.getMatchedPolicyId());
    }
}
