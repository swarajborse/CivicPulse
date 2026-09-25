package com.waregaon.complaint.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String action;

    private Long complaintId;

    private Long userId;

    private String userName;

    private String details;

    private LocalDateTime createdAt;

    public AuditLog() {}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public Long getComplaintId() { return complaintId; }
    public void setComplaintId(Long complaintId) { this.complaintId = complaintId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final AuditLog a = new AuditLog();

        public Builder action(String action) { a.action = action; return this; }
        public Builder complaintId(Long complaintId) { a.complaintId = complaintId; return this; }
        public Builder userId(Long userId) { a.userId = userId; return this; }
        public Builder userName(String userName) { a.userName = userName; return this; }
        public Builder details(String details) { a.details = details; return this; }

        public AuditLog build() { return a; }
    }
}
