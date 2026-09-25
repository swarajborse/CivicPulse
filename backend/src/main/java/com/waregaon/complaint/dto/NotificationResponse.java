package com.waregaon.complaint.dto;

import java.time.LocalDateTime;

public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private String type;
    private Long complaintId;
    private boolean read;
    private LocalDateTime createdAt;

    public NotificationResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Long getComplaintId() { return complaintId; }
    public void setComplaintId(Long complaintId) { this.complaintId = complaintId; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final NotificationResponse n = new NotificationResponse();

        public Builder id(Long id) { n.id = id; return this; }
        public Builder title(String title) { n.title = title; return this; }
        public Builder message(String message) { n.message = message; return this; }
        public Builder type(String type) { n.type = type; return this; }
        public Builder complaintId(Long complaintId) { n.complaintId = complaintId; return this; }
        public Builder read(boolean read) { n.read = read; return this; }
        public Builder createdAt(LocalDateTime createdAt) { n.createdAt = createdAt; return this; }

        public NotificationResponse build() { return n; }
    }
}
