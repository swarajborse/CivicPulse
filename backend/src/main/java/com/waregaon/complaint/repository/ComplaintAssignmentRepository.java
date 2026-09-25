package com.waregaon.complaint.repository;

import com.waregaon.complaint.entity.ComplaintAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintAssignmentRepository extends JpaRepository<ComplaintAssignment, Long> {
    List<ComplaintAssignment> findByComplaintId(Long complaintId);
    Optional<ComplaintAssignment> findTopByComplaintIdOrderByAssignedAtDesc(Long complaintId);
}
