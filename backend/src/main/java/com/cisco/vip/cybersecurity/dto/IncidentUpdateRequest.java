package com.cisco.vip.cybersecurity.dto;

import jakarta.validation.constraints.NotBlank;

public class IncidentUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status; // "DETECTED", "INVESTIGATING", "CONTAINED", "RESOLVED"

    private String containmentNotes;
    private String resolvedBy;
    private boolean quarantineWorkload = false;

    public IncidentUpdateRequest() {
    }

    public IncidentUpdateRequest(String status, String containmentNotes, String resolvedBy, boolean quarantineWorkload) {
        this.status = status;
        this.containmentNotes = containmentNotes;
        this.resolvedBy = resolvedBy;
        this.quarantineWorkload = quarantineWorkload;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getContainmentNotes() {
        return containmentNotes;
    }

    public void setContainmentNotes(String containmentNotes) {
        this.containmentNotes = containmentNotes;
    }

    public String getResolvedBy() {
        return resolvedBy;
    }

    public void setResolvedBy(String resolvedBy) {
        this.resolvedBy = resolvedBy;
    }

    public boolean isQuarantineWorkload() {
        return quarantineWorkload;
    }

    public void setQuarantineWorkload(boolean quarantineWorkload) {
        this.quarantineWorkload = quarantineWorkload;
    }
}
