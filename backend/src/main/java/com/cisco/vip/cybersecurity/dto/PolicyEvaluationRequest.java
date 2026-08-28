package com.cisco.vip.cybersecurity.dto;

import jakarta.validation.constraints.NotBlank;

public class PolicyEvaluationRequest {
    @NotBlank(message = "Source is required")
    private String source;

    @NotBlank(message = "Destination is required")
    private String destination;

    private String protocol = "TCP";
    private String port = "80";
    private String role; // optional user role context

    public PolicyEvaluationRequest() {
    }

    public PolicyEvaluationRequest(String source, String destination, String protocol, String port, String role) {
        this.source = source;
        this.destination = destination;
        this.protocol = protocol;
        this.port = port;
        this.role = role;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
