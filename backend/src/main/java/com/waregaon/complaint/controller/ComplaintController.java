package com.waregaon.complaint.controller;

import com.waregaon.complaint.dto.*;
import com.waregaon.complaint.dto.TimelineEntry;
import com.waregaon.complaint.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ComplaintResponse> createComplaint(
            @Valid @RequestBody ComplaintRequest request,
            Authentication authentication) {
        ComplaintResponse response = complaintService.createComplaint(request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(Authentication authentication) {
        List<ComplaintResponse> complaints = complaintService.getMyComplaints(authentication.getName());
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponse> getComplaintById(@PathVariable Long id) {
        ComplaintResponse complaint = complaintService.getComplaintById(id);
        return ResponseEntity.ok(complaint);
    }

    @GetMapping("/track/{complaintId}")
    public ResponseEntity<ComplaintResponse> getComplaintByComplaintId(@PathVariable String complaintId) {
        ComplaintResponse complaint = complaintService.getComplaintByComplaintId(complaintId);
        return ResponseEntity.ok(complaint);
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<List<TimelineEntry>> getComplaintTimeline(@PathVariable Long id) {
        List<TimelineEntry> timeline = complaintService.getComplaintTimeline(id);
        return ResponseEntity.ok(timeline);
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<ComplaintResponse> assignWorker(
            @PathVariable Long id,
            @Valid @RequestBody AssignWorkerRequest request,
            Authentication authentication) {
        ComplaintResponse response = complaintService.assignWorker(id, request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ComplaintResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request,
            Authentication authentication) {
        ComplaintResponse response = complaintService.updateStatus(id, request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<ComplaintResponse> submitFeedback(
            @PathVariable Long id,
            @Valid @RequestBody FeedbackRequest request,
            Authentication authentication) {
        ComplaintResponse response = complaintService.submitFeedback(id, request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/worker/my")
    public ResponseEntity<List<ComplaintResponse>> getWorkerComplaints(Authentication authentication) {
        List<ComplaintResponse> complaints = complaintService.getWorkerComplaints(authentication.getName());
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/worker/stats")
    public ResponseEntity<WorkerStatsResponse> getWorkerStats(Authentication authentication) {
        WorkerStatsResponse stats = complaintService.getWorkerStats(authentication.getName());
        return ResponseEntity.ok(stats);
    }
}
