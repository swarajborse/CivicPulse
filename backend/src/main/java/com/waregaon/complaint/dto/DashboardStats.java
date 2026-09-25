package com.waregaon.complaint.dto;

import java.util.Map;

public class DashboardStats {
    private long totalComplaints;
    private long pendingComplaints;
    private long assignedComplaints;
    private long inProgressComplaints;
    private long resolvedComplaints;
    private long closedComplaints;
    private long overdueComplaints;
    private Map<String, Long> categoryStats;
    private Map<String, Long> priorityStats;

    public DashboardStats() {}

    public long getTotalComplaints() { return totalComplaints; }
    public void setTotalComplaints(long totalComplaints) { this.totalComplaints = totalComplaints; }
    public long getPendingComplaints() { return pendingComplaints; }
    public void setPendingComplaints(long pendingComplaints) { this.pendingComplaints = pendingComplaints; }
    public long getAssignedComplaints() { return assignedComplaints; }
    public void setAssignedComplaints(long assignedComplaints) { this.assignedComplaints = assignedComplaints; }
    public long getInProgressComplaints() { return inProgressComplaints; }
    public void setInProgressComplaints(long inProgressComplaints) { this.inProgressComplaints = inProgressComplaints; }
    public long getResolvedComplaints() { return resolvedComplaints; }
    public void setResolvedComplaints(long resolvedComplaints) { this.resolvedComplaints = resolvedComplaints; }
    public long getClosedComplaints() { return closedComplaints; }
    public void setClosedComplaints(long closedComplaints) { this.closedComplaints = closedComplaints; }
    public long getOverdueComplaints() { return overdueComplaints; }
    public void setOverdueComplaints(long overdueComplaints) { this.overdueComplaints = overdueComplaints; }
    public Map<String, Long> getCategoryStats() { return categoryStats; }
    public void setCategoryStats(Map<String, Long> categoryStats) { this.categoryStats = categoryStats; }
    public Map<String, Long> getPriorityStats() { return priorityStats; }
    public void setPriorityStats(Map<String, Long> priorityStats) { this.priorityStats = priorityStats; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final DashboardStats s = new DashboardStats();

        public Builder totalComplaints(long v) { s.totalComplaints = v; return this; }
        public Builder pendingComplaints(long v) { s.pendingComplaints = v; return this; }
        public Builder assignedComplaints(long v) { s.assignedComplaints = v; return this; }
        public Builder inProgressComplaints(long v) { s.inProgressComplaints = v; return this; }
        public Builder resolvedComplaints(long v) { s.resolvedComplaints = v; return this; }
        public Builder closedComplaints(long v) { s.closedComplaints = v; return this; }
        public Builder overdueComplaints(long v) { s.overdueComplaints = v; return this; }
        public Builder categoryStats(Map<String, Long> v) { s.categoryStats = v; return this; }
        public Builder priorityStats(Map<String, Long> v) { s.priorityStats = v; return this; }

        public DashboardStats build() { return s; }
    }
}
