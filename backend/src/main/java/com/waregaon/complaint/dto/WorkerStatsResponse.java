package com.waregaon.complaint.dto;

public class WorkerStatsResponse {
    private long totalAssigned;
    private long pending;
    private long inProgress;
    private long completed;
    private long overdue;

    public WorkerStatsResponse() {}

    public long getTotalAssigned() { return totalAssigned; }
    public void setTotalAssigned(long totalAssigned) { this.totalAssigned = totalAssigned; }
    public long getPending() { return pending; }
    public void setPending(long pending) { this.pending = pending; }
    public long getInProgress() { return inProgress; }
    public void setInProgress(long inProgress) { this.inProgress = inProgress; }
    public long getCompleted() { return completed; }
    public void setCompleted(long completed) { this.completed = completed; }
    public long getOverdue() { return overdue; }
    public void setOverdue(long overdue) { this.overdue = overdue; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final WorkerStatsResponse w = new WorkerStatsResponse();

        public Builder totalAssigned(long v) { w.totalAssigned = v; return this; }
        public Builder pending(long v) { w.pending = v; return this; }
        public Builder inProgress(long v) { w.inProgress = v; return this; }
        public Builder completed(long v) { w.completed = v; return this; }
        public Builder overdue(long v) { w.overdue = v; return this; }

        public WorkerStatsResponse build() { return w; }
    }
}
