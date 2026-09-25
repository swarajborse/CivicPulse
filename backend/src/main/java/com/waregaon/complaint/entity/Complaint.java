package com.waregaon.complaint.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints", indexes = {
    @Index(name = "idx_complaint_id", columnList = "complaintId"),
    @Index(name = "idx_complaint_status", columnList = "status"),
    @Index(name = "idx_complaint_category", columnList = "category")
})
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String complaintId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Category category;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    private Double latitude;
    private Double longitude;

    private LocalDateTime deadline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_worker_id")
    private User assignedWorker;

    private String assignedWorkerName;

    private String imageUrl;
    private String beforeImageUrl;
    private String afterImageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    @Column(nullable = false)
    private String citizenName;

    private String citizenPhone;

    private String remarks;

    @Enumerated(EnumType.STRING)
    private FeedbackStatus feedbackStatus;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    public Complaint() {}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = Status.PENDING;
        }
        if (feedbackStatus == null) {
            feedbackStatus = FeedbackStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public boolean isOverdue() {
        return deadline != null && LocalDateTime.now().isAfter(deadline) &&
               status != Status.RESOLVED && status != Status.CLOSED;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getComplaintId() { return complaintId; }
    public void setComplaintId(String complaintId) { this.complaintId = complaintId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }
    public User getAssignedWorker() { return assignedWorker; }
    public void setAssignedWorker(User assignedWorker) { this.assignedWorker = assignedWorker; }
    public String getAssignedWorkerName() { return assignedWorkerName; }
    public void setAssignedWorkerName(String assignedWorkerName) { this.assignedWorkerName = assignedWorkerName; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getBeforeImageUrl() { return beforeImageUrl; }
    public void setBeforeImageUrl(String beforeImageUrl) { this.beforeImageUrl = beforeImageUrl; }
    public String getAfterImageUrl() { return afterImageUrl; }
    public void setAfterImageUrl(String afterImageUrl) { this.afterImageUrl = afterImageUrl; }
    public User getCitizen() { return citizen; }
    public void setCitizen(User citizen) { this.citizen = citizen; }
    public String getCitizenName() { return citizenName; }
    public void setCitizenName(String citizenName) { this.citizenName = citizenName; }
    public String getCitizenPhone() { return citizenPhone; }
    public void setCitizenPhone(String citizenPhone) { this.citizenPhone = citizenPhone; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public FeedbackStatus getFeedbackStatus() { return feedbackStatus; }
    public void setFeedbackStatus(FeedbackStatus feedbackStatus) { this.feedbackStatus = feedbackStatus; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public enum Category {
        ROAD, WATER, ELECTRICITY, GARBAGE, DRAINAGE, STREET_LIGHT, PUBLIC_SAFETY, OTHER
    }

    public enum Status {
        PENDING, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED
    }

    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }

    public enum FeedbackStatus {
        PENDING, GIVEN
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Complaint c = new Complaint();

        public Builder title(String title) { c.title = title; return this; }
        public Builder description(String description) { c.description = description; return this; }
        public Builder category(Category category) { c.category = category; return this; }
        public Builder location(String location) { c.location = location; return this; }
        public Builder status(Status status) { c.status = status; return this; }
        public Builder priority(Priority priority) { c.priority = priority; return this; }
        public Builder latitude(Double latitude) { c.latitude = latitude; return this; }
        public Builder longitude(Double longitude) { c.longitude = longitude; return this; }
        public Builder deadline(LocalDateTime deadline) { c.deadline = deadline; return this; }
        public Builder assignedWorker(User assignedWorker) { c.assignedWorker = assignedWorker; return this; }
        public Builder assignedWorkerName(String assignedWorkerName) { c.assignedWorkerName = assignedWorkerName; return this; }
        public Builder imageUrl(String imageUrl) { c.imageUrl = imageUrl; return this; }
        public Builder beforeImageUrl(String beforeImageUrl) { c.beforeImageUrl = beforeImageUrl; return this; }
        public Builder afterImageUrl(String afterImageUrl) { c.afterImageUrl = afterImageUrl; return this; }
        public Builder citizen(User citizen) { c.citizen = citizen; return this; }
        public Builder citizenName(String citizenName) { c.citizenName = citizenName; return this; }
        public Builder citizenPhone(String citizenPhone) { c.citizenPhone = citizenPhone; return this; }
        public Builder remarks(String remarks) { c.remarks = remarks; return this; }
        public Builder feedbackStatus(FeedbackStatus feedbackStatus) { c.feedbackStatus = feedbackStatus; return this; }
        public Builder resolvedAt(LocalDateTime resolvedAt) { c.resolvedAt = resolvedAt; return this; }
        public Builder complaintId(String complaintId) { c.complaintId = complaintId; return this; }

        public Complaint build() { return c; }
    }
}
