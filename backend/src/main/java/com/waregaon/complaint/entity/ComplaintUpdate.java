package com.waregaon.complaint.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_updates")
public class ComplaintUpdate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by_id", nullable = false)
    private User updatedBy;

    @Enumerated(EnumType.STRING)
    private Complaint.Status previousStatus;

    @Enumerated(EnumType.STRING)
    private Complaint.Status newStatus;

    private String remarks;

    private LocalDateTime createdAt;

    public ComplaintUpdate() {}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Complaint getComplaint() { return complaint; }
    public void setComplaint(Complaint complaint) { this.complaint = complaint; }
    public User getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(User updatedBy) { this.updatedBy = updatedBy; }
    public Complaint.Status getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(Complaint.Status previousStatus) { this.previousStatus = previousStatus; }
    public Complaint.Status getNewStatus() { return newStatus; }
    public void setNewStatus(Complaint.Status newStatus) { this.newStatus = newStatus; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final ComplaintUpdate u = new ComplaintUpdate();

        public Builder complaint(Complaint complaint) { u.complaint = complaint; return this; }
        public Builder updatedBy(User updatedBy) { u.updatedBy = updatedBy; return this; }
        public Builder previousStatus(Complaint.Status previousStatus) { u.previousStatus = previousStatus; return this; }
        public Builder newStatus(Complaint.Status newStatus) { u.newStatus = newStatus; return this; }
        public Builder remarks(String remarks) { u.remarks = remarks; return this; }

        public ComplaintUpdate build() { return u; }
    }
}
