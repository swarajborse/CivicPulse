package com.waregaon.complaint.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_assignments")
public class ComplaintAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private User worker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by_id", nullable = false)
    private User assignedBy;

    private String notes;

    private LocalDateTime assignedAt;

    public ComplaintAssignment() {}

    @PrePersist
    protected void onCreate() {
        assignedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Complaint getComplaint() { return complaint; }
    public void setComplaint(Complaint complaint) { this.complaint = complaint; }
    public User getWorker() { return worker; }
    public void setWorker(User worker) { this.worker = worker; }
    public User getAssignedBy() { return assignedBy; }
    public void setAssignedBy(User assignedBy) { this.assignedBy = assignedBy; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final ComplaintAssignment a = new ComplaintAssignment();

        public Builder complaint(Complaint complaint) { a.complaint = complaint; return this; }
        public Builder worker(User worker) { a.worker = worker; return this; }
        public Builder assignedBy(User assignedBy) { a.assignedBy = assignedBy; return this; }
        public Builder notes(String notes) { a.notes = notes; return this; }

        public ComplaintAssignment build() { return a; }
    }
}
