package com.waregaon.complaint.controller;

import com.waregaon.complaint.dto.*;
import com.waregaon.complaint.service.AuditService;
import com.waregaon.complaint.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private AuditService auditService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboard() {
        DashboardStats stats = complaintService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/complaints")
    public ResponseEntity<Page<ComplaintResponse>> getAllComplaints(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        if (search != null && !search.trim().isEmpty()) {
            Page<ComplaintResponse> result = complaintService.searchComplaints(search.trim(), page, size);
            return ResponseEntity.ok(result);
        }
        List<ComplaintResponse> all = complaintService.getAllComplaints();
        Page<ComplaintResponse> pageResult = new PageImpl<>(
                all.subList(Math.min(page * size, all.size()), Math.min((page + 1) * size, all.size())),
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")),
                all.size()
        );
        return ResponseEntity.ok(pageResult);
    }

    @GetMapping("/workers")
    public ResponseEntity<List<UserResponse>> getWorkers() {
        List<UserResponse> workers = complaintService.getWorkers();
        return ResponseEntity.ok(workers);
    }

    @GetMapping("/audit/{complaintId}")
    public ResponseEntity<List<AuditLogResponse>> getAuditLog(@PathVariable Long complaintId) {
        List<AuditLogResponse> logs = auditService.getComplaintAuditLog(complaintId);
        return ResponseEntity.ok(logs);
    }
}
