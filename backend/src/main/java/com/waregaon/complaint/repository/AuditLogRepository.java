package com.waregaon.complaint.repository;

import com.waregaon.complaint.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByComplaintIdOrderByCreatedAtDesc(Long complaintId);
    List<AuditLog> findTop50ByOrderByCreatedAtDesc();
}
