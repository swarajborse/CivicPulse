package com.waregaon.complaint.dto;

import java.time.LocalDateTime;

public class ComplaintResponse {
    private Long id;
    private String complaintId;
    private String title;
    private String description;
    private String category;
    private String location;
    private String status;
    private String priority;
    private String imageUrl;
    private String citizenName;
    private String citizenPhone;
    private String assignedWorkerName;
    private String remarks;
    private Double latitude;
    private Double longitude;
    private LocalDateTime deadline;
    private String beforeImageUrl;
    private String afterImageUrl;
    private String feedbackStatus;
    private boolean overdue;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    public ComplaintResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getComplaintId() { return complaintId; }
    public void setComplaintId(String complaintId) { this.complaintId = complaintId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getCitizenName() { return citizenName; }
    public void setCitizenName(String citizenName) { this.citizenName = citizenName; }
    public String getCitizenPhone() { return citizenPhone; }
    public void setCitizenPhone(String citizenPhone) { this.citizenPhone = citizenPhone; }
    public String getAssignedWorkerName() { return assignedWorkerName; }
    public void setAssignedWorkerName(String assignedWorkerName) { this.assignedWorkerName = assignedWorkerName; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }
    public String getBeforeImageUrl() { return beforeImageUrl; }
    public void setBeforeImageUrl(String beforeImageUrl) { this.beforeImageUrl = beforeImageUrl; }
    public String getAfterImageUrl() { return afterImageUrl; }
    public void setAfterImageUrl(String afterImageUrl) { this.afterImageUrl = afterImageUrl; }
    public String getFeedbackStatus() { return feedbackStatus; }
    public void setFeedbackStatus(String feedbackStatus) { this.feedbackStatus = feedbackStatus; }
    public boolean isOverdue() { return overdue; }
    public void setOverdue(boolean overdue) { this.overdue = overdue; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final ComplaintResponse r = new ComplaintResponse();

        public Builder id(Long id) { r.id = id; return this; }
        public Builder complaintId(String complaintId) { r.complaintId = complaintId; return this; }
        public Builder title(String title) { r.title = title; return this; }
        public Builder description(String description) { r.description = description; return this; }
        public Builder category(String category) { r.category = category; return this; }
        public Builder location(String location) { r.location = location; return this; }
        public Builder status(String status) { r.status = status; return this; }
        public Builder priority(String priority) { r.priority = priority; return this; }
        public Builder imageUrl(String imageUrl) { r.imageUrl = imageUrl; return this; }
        public Builder citizenName(String citizenName) { r.citizenName = citizenName; return this; }
        public Builder citizenPhone(String citizenPhone) { r.citizenPhone = citizenPhone; return this; }
        public Builder assignedWorkerName(String assignedWorkerName) { r.assignedWorkerName = assignedWorkerName; return this; }
        public Builder remarks(String remarks) { r.remarks = remarks; return this; }
        public Builder latitude(Double latitude) { r.latitude = latitude; return this; }
        public Builder longitude(Double longitude) { r.longitude = longitude; return this; }
        public Builder deadline(LocalDateTime deadline) { r.deadline = deadline; return this; }
        public Builder beforeImageUrl(String beforeImageUrl) { r.beforeImageUrl = beforeImageUrl; return this; }
        public Builder afterImageUrl(String afterImageUrl) { r.afterImageUrl = afterImageUrl; return this; }
        public Builder feedbackStatus(String feedbackStatus) { r.feedbackStatus = feedbackStatus; return this; }
        public Builder overdue(boolean overdue) { r.overdue = overdue; return this; }
        public Builder createdAt(LocalDateTime createdAt) { r.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { r.updatedAt = updatedAt; return this; }
        public Builder resolvedAt(LocalDateTime resolvedAt) { r.resolvedAt = resolvedAt; return this; }

        public ComplaintResponse build() { return r; }
    }
}
