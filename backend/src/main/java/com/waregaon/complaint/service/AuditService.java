package com.waregaon.complaint.service;

import com.waregaon.complaint.dto.AuditLogResponse;
import com.waregaon.complaint.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditService {
    @Autowired private AuditLogRepository auditLogRepository;

    public List<AuditLogResponse> getComplaintAuditLog(Long complaintId) {
        return auditLogRepository.findByComplaintIdOrderByCreatedAtDesc(complaintId)
                .stream().map(l -> {
                    AuditLogResponse r = new AuditLogResponse();
                    r.setId(l.getId());
                    r.setAction(l.getAction());
                    r.setComplaintId(l.getComplaintId());
                    r.setUserName(l.getUserName());
                    r.setDetails(l.getDetails());
                    r.setCreatedAt(l.getCreatedAt());
                    return r;
                }).collect(Collectors.toList());
    }
}
