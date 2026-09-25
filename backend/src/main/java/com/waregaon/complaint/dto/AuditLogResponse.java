package com.waregaon.complaint.dto;

import java.time.LocalDateTime;

public class AuditLogResponse {
    private Long id;
    private String action;
    private Long complaintId;
    private String userName;
    private String details;
    private LocalDateTime createdAt;

    public AuditLogResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public Long getComplaintId() { return complaintId; }
    public void setComplaintId(Long complaintId) { this.complaintId = complaintId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final AuditLogResponse a = new AuditLogResponse();

        public Builder id(Long id) { a.id = id; return this; }
        public Builder action(String action) { a.action = action; return this; }
        public Builder complaintId(Long complaintId) { a.complaintId = complaintId; return this; }
        public Builder userName(String userName) { a.userName = userName; return this; }
        public Builder details(String details) { a.details = details; return this; }
        public Builder createdAt(LocalDateTime createdAt) { a.createdAt = createdAt; return this; }

        public AuditLogResponse build() { return a; }
    }
}
