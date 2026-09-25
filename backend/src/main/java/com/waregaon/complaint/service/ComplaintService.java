package com.waregaon.complaint.service;

import com.waregaon.complaint.dto.*;
import com.waregaon.complaint.entity.*;
import com.waregaon.complaint.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    @Autowired private ComplaintRepository complaintRepository;
    @Autowired private ComplaintAssignmentRepository assignmentRepository;
    @Autowired private ComplaintUpdateRepository updateRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private FeedbackRepository feedbackRepository;

    @Transactional
    public ComplaintResponse createComplaint(ComplaintRequest request, String citizenEmail) {
        User citizen = userRepository.findByEmail(citizenEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = new Complaint();
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCategory(Complaint.Category.valueOf(request.getCategory().toUpperCase()));
        complaint.setLocation(request.getLocation());
        complaint.setStatus(Complaint.Status.PENDING);
        complaint.setPriority(request.getPriority() != null ?
            Complaint.Priority.valueOf(request.getPriority().toUpperCase()) : Complaint.Priority.MEDIUM);
        complaint.setCitizen(citizen);
        complaint.setCitizenName(citizen.getFullName());
        complaint.setCitizenPhone(citizen.getPhone());
        complaint.setLatitude(request.getLatitude());
        complaint.setLongitude(request.getLongitude());
        complaint.setFeedbackStatus(Complaint.FeedbackStatus.PENDING);
        complaint.setDeadline(calculateDeadline(request.getPriority()));

        String complaintId = generateComplaintId();
        complaint.setComplaintId(complaintId);

        complaintRepository.save(complaint);

        saveAuditLog("COMPLAINT_CREATED", complaint.getId(), citizen.getId(), citizen.getFullName(),
            "Complaint created: " + complaint.getTitle());

        createNotification(null, "Complaint Submitted",
            "Your complaint " + complaintId + " has been registered successfully.",
            "COMPLAINT_SUBMITTED", complaint.getId());

        return mapToResponse(complaint);
    }

    public List<ComplaintResponse> getMyComplaints(String citizenEmail) {
        User citizen = userRepository.findByEmail(citizenEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return complaintRepository.findByCitizenOrderByCreatedAtDesc(citizen)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ComplaintResponse> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ComplaintResponse getComplaintById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        return mapToResponse(complaint);
    }

    public ComplaintResponse getComplaintByComplaintId(String complaintId) {
        Complaint complaint = complaintRepository.findByComplaintId(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + complaintId));
        return mapToResponse(complaint);
    }

    public Page<ComplaintResponse> searchComplaints(String search, int page, int size) {
        Page<Complaint> complaints = complaintRepository.searchComplaints(search,
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return complaints.map(this::mapToResponse);
    }

    @Transactional
    public ComplaintResponse assignWorker(Long complaintId, AssignWorkerRequest request, String adminEmail) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        User worker = userRepository.findById(request.getWorkerId())
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        long activeCount = complaintRepository.countByAssignedWorkerAndStatusIn(worker,
            Arrays.asList(Complaint.Status.ASSIGNED, Complaint.Status.IN_PROGRESS));
        if (activeCount >= 10) {
            throw new RuntimeException("Worker has too many active assignments (max 10)");
        }

        Complaint.Status previousStatus = complaint.getStatus();
        complaint.setStatus(Complaint.Status.ASSIGNED);
        complaint.setAssignedWorkerName(worker.getFullName());
        complaint.setAssignedWorker(worker);
        complaintRepository.save(complaint);

        ComplaintAssignment assignment = new ComplaintAssignment();
        assignment.setComplaint(complaint);
        assignment.setWorker(worker);
        assignment.setAssignedBy(admin);
        assignment.setNotes(request.getNotes());
        assignmentRepository.save(assignment);

        ComplaintUpdate update = new ComplaintUpdate();
        update.setComplaint(complaint);
        update.setUpdatedBy(admin);
        update.setPreviousStatus(previousStatus);
        update.setNewStatus(Complaint.Status.ASSIGNED);
        update.setRemarks("Assigned to " + worker.getFullName());
        updateRepository.save(update);

        saveAuditLog("COMPLAINT_ASSIGNED", complaint.getId(), admin.getId(), admin.getFullName(),
            "Assigned to " + worker.getFullName());

        createNotification(worker.getId(), "Complaint Assigned",
            "Complaint " + complaint.getComplaintId() + " has been assigned to you.",
            "COMPLAINT_ASSIGNED", complaint.getId());

        createNotification(complaint.getCitizen().getId(), "Complaint Assigned",
            "Your complaint " + complaint.getComplaintId() + " has been assigned to " + worker.getFullName() + ".",
            "COMPLAINT_ASSIGNED", complaint.getId());

        return mapToResponse(complaint);
    }

    @Transactional
    public ComplaintResponse updateStatus(Long complaintId, UpdateStatusRequest request, String userEmail) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint.Status previousStatus = complaint.getStatus();
        Complaint.Status newStatus = Complaint.Status.valueOf(request.getStatus().toUpperCase());
        complaint.setStatus(newStatus);

        if (newStatus == Complaint.Status.RESOLVED) {
            complaint.setResolvedAt(LocalDateTime.now());
        }
        if (request.getRemarks() != null) {
            complaint.setRemarks(request.getRemarks());
        }

        complaintRepository.save(complaint);

        ComplaintUpdate update = new ComplaintUpdate();
        update.setComplaint(complaint);
        update.setUpdatedBy(user);
        update.setPreviousStatus(previousStatus);
        update.setNewStatus(newStatus);
        update.setRemarks(request.getRemarks());
        updateRepository.save(update);

        String action = "STATUS_CHANGED";
        if (newStatus == Complaint.Status.IN_PROGRESS) action = "WORK_STARTED";
        else if (newStatus == Complaint.Status.RESOLVED) action = "COMPLAINT_RESOLVED";
        else if (newStatus == Complaint.Status.CLOSED) action = "COMPLAINT_CLOSED";

        saveAuditLog(action, complaint.getId(), user.getId(), user.getFullName(),
            "Status changed from " + previousStatus + " to " + newStatus);

        String notifMsg = "Status of complaint " + complaint.getComplaintId() + " changed to " + newStatus;
        if (newStatus == Complaint.Status.IN_PROGRESS) notifMsg = "Work has started on complaint " + complaint.getComplaintId();
        else if (newStatus == Complaint.Status.RESOLVED) notifMsg = "Complaint " + complaint.getComplaintId() + " has been resolved.";

        createNotification(complaint.getCitizen().getId(), "Status Update", notifMsg, "STATUS_CHANGED", complaint.getId());

        return mapToResponse(complaint);
    }

    @Transactional
    public ComplaintResponse submitFeedback(Long complaintId, FeedbackRequest request, String userEmail) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (complaint.getFeedbackStatus() == Complaint.FeedbackStatus.GIVEN) {
            throw new RuntimeException("Feedback already submitted for this complaint");
        }

        Feedback feedback = new Feedback();
        feedback.setComplaint(complaint);
        feedback.setUser(user);
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        feedbackRepository.save(feedback);

        complaint.setFeedbackStatus(Complaint.FeedbackStatus.GIVEN);
        complaintRepository.save(complaint);

        return mapToResponse(complaint);
    }

    public DashboardStats getDashboardStats() {
        List<Complaint.Status> activeStatuses = Arrays.asList(Complaint.Status.ASSIGNED, Complaint.Status.IN_PROGRESS);
        long overdue = complaintRepository.countByDeadlineBeforeAndStatusNotIn(LocalDateTime.now(),
            Arrays.asList(Complaint.Status.RESOLVED, Complaint.Status.CLOSED));

        Map<String, Long> categoryStats = new LinkedHashMap<>();
        for (Complaint.Category cat : Complaint.Category.values()) {
            categoryStats.put(cat.name(), complaintRepository.countByCategory(cat));
        }
        Map<String, Long> priorityStats = new LinkedHashMap<>();
        for (Complaint.Priority p : Complaint.Priority.values()) {
            priorityStats.put(p.name(), complaintRepository.countByPriority(p));
        }

        return DashboardStats.builder()
                .totalComplaints(complaintRepository.count())
                .pendingComplaints(complaintRepository.countByStatus(Complaint.Status.PENDING))
                .assignedComplaints(complaintRepository.countByStatus(Complaint.Status.ASSIGNED))
                .inProgressComplaints(complaintRepository.countByStatus(Complaint.Status.IN_PROGRESS))
                .resolvedComplaints(complaintRepository.countByStatus(Complaint.Status.RESOLVED))
                .closedComplaints(complaintRepository.countByStatus(Complaint.Status.CLOSED))
                .overdueComplaints(overdue)
                .categoryStats(categoryStats)
                .priorityStats(priorityStats)
                .build();
    }

    public List<UserResponse> getWorkers() {
        return userRepository.findByRole(User.Role.WORKER).stream()
                .map(user -> {
                    long activeCount = complaintRepository.countByAssignedWorkerAndStatusIn(user,
                        Arrays.asList(Complaint.Status.ASSIGNED, Complaint.Status.IN_PROGRESS));
                    UserResponse resp = new UserResponse();
                    resp.setId(user.getId());
                    resp.setEmail(user.getEmail());
                    resp.setFullName(user.getFullName());
                    resp.setPhone(user.getPhone());
                    resp.setRole(user.getRole().name());
                    resp.setEnabled(user.isEnabled());
                    resp.setVillage(user.getVillage());
                    resp.setActiveComplaintCount(activeCount);
                    return resp;
                }).collect(Collectors.toList());
    }

    public List<ComplaintResponse> getWorkerComplaints(String workerEmail) {
        return complaintRepository.findByAssignedWorkerNameOrderByCreatedAtDesc(
                userRepository.findByEmail(workerEmail)
                        .orElseThrow(() -> new RuntimeException("Worker not found"))
                        .getFullName()
        ).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public WorkerStatsResponse getWorkerStats(String workerEmail) {
        User worker = userRepository.findByEmail(workerEmail)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        return WorkerStatsResponse.builder()
                .totalAssigned(complaintRepository.countByAssignedWorker(worker))
                .pending(complaintRepository.countByAssignedWorkerAndStatusIn(worker,
                    Arrays.asList(Complaint.Status.ASSIGNED)))
                .inProgress(complaintRepository.countByAssignedWorkerAndStatusIn(worker,
                    Arrays.asList(Complaint.Status.IN_PROGRESS)))
                .completed(complaintRepository.countByAssignedWorkerAndStatusIn(worker,
                    Arrays.asList(Complaint.Status.RESOLVED, Complaint.Status.CLOSED)))
                .overdue(complaintRepository.countByDeadlineBeforeAndStatusNotIn(LocalDateTime.now(),
                    Arrays.asList(Complaint.Status.RESOLVED, Complaint.Status.CLOSED)))
                .build();
    }

    public List<TimelineEntry> getComplaintTimeline(Long complaintId) {
        return updateRepository.findByComplaintIdOrderByCreatedAtDesc(complaintId)
                .stream().map(u -> {
                    TimelineEntry entry = new TimelineEntry();
                    entry.setId(u.getId());
                    String action = u.getNewStatus() != null ? "Status changed to " + u.getNewStatus().name() : "Updated";
                    entry.setAction(action);
                    entry.setPreviousStatus(u.getPreviousStatus() != null ? u.getPreviousStatus().name() : null);
                    entry.setNewStatus(u.getNewStatus() != null ? u.getNewStatus().name() : null);
                    entry.setRemarks(u.getRemarks());
                    entry.setUpdatedByName(u.getUpdatedBy() != null ? u.getUpdatedBy().getFullName() : "System");
                    entry.setCreatedAt(u.getCreatedAt());
                    return entry;
                }).collect(Collectors.toList());
    }

    private String generateComplaintId() {
        long count = complaintRepository.count() + 1;
        return String.format("WGR-%d-%06d", LocalDateTime.now().getYear(), count);
    }

    private LocalDateTime calculateDeadline(String priority) {
        Complaint.Priority p = priority != null ? Complaint.Priority.valueOf(priority.toUpperCase()) : Complaint.Priority.MEDIUM;
        LocalDateTime now = LocalDateTime.now();
        switch (p) {
            case URGENT: return now.plusHours(24);
            case HIGH: return now.plusDays(3);
            case MEDIUM: return now.plusDays(5);
            case LOW: return now.plusDays(7);
            default: return now.plusDays(5);
        }
    }

    private void createNotification(Long userId, String title, String message, String type, Long complaintId) {
        if (userId == null) return;
        Notification notif = new Notification();
        notif.setUser(userRepository.findById(userId).orElse(null));
        notif.setTitle(title);
        notif.setMessage(message);
        notif.setType(type);
        notif.setComplaintId(complaintId);
        notificationRepository.save(notif);
    }

    private void saveAuditLog(String action, Long complaintId, Long userId, String userName, String details) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setComplaintId(complaintId);
        log.setUserId(userId);
        log.setUserName(userName);
        log.setDetails(details);
        auditLogRepository.save(log);
    }

    private ComplaintResponse mapToResponse(Complaint c) {
        ComplaintResponse r = new ComplaintResponse();
        r.setId(c.getId());
        r.setComplaintId(c.getComplaintId());
        r.setTitle(c.getTitle());
        r.setDescription(c.getDescription());
        r.setCategory(c.getCategory().name());
        r.setLocation(c.getLocation());
        r.setStatus(c.getStatus().name());
        r.setPriority(c.getPriority() != null ? c.getPriority().name() : "MEDIUM");
        r.setLatitude(c.getLatitude());
        r.setLongitude(c.getLongitude());
        r.setImageUrl(c.getImageUrl());
        r.setBeforeImageUrl(c.getBeforeImageUrl());
        r.setAfterImageUrl(c.getAfterImageUrl());
        r.setCitizenName(c.getCitizenName());
        r.setCitizenPhone(c.getCitizenPhone());
        r.setAssignedWorkerName(c.getAssignedWorkerName());
        r.setRemarks(c.getRemarks());
        r.setCreatedAt(c.getCreatedAt());
        r.setUpdatedAt(c.getUpdatedAt());
        r.setResolvedAt(c.getResolvedAt());
        r.setDeadline(c.getDeadline());
        r.setOverdue(c.isOverdue());
        r.setFeedbackStatus(c.getFeedbackStatus() != null ? c.getFeedbackStatus().name() : "PENDING");
        return r;
    }
}
