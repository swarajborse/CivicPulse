package com.waregaon.complaint.dto;

import jakarta.validation.constraints.NotNull;

public class AssignWorkerRequest {
    @NotNull(message = "Worker ID is required")
    private Long workerId;

    private String notes;

    public Long getWorkerId() { return workerId; }
    public void setWorkerId(Long workerId) { this.workerId = workerId; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
