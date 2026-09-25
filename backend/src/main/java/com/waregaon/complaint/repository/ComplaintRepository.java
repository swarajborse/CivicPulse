package com.waregaon.complaint.repository;

import com.waregaon.complaint.entity.Complaint;
import com.waregaon.complaint.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByCitizenOrderByCreatedAtDesc(User citizen);
    List<Complaint> findByStatusOrderByCreatedAtDesc(Complaint.Status status);
    List<Complaint> findAllByOrderByCreatedAtDesc();
    long countByStatus(Complaint.Status status);
    List<Complaint> findByAssignedWorkerNameOrderByCreatedAtDesc(String workerName);
    Optional<Complaint> findByComplaintId(String complaintId);

    @Query("SELECT c FROM Complaint c WHERE c.complaintId LIKE %:search% OR c.title LIKE %:search% OR c.citizenName LIKE %:search%")
    Page<Complaint> searchComplaints(@Param("search") String search, Pageable pageable);

    Page<Complaint> findByStatus(Complaint.Status status, Pageable pageable);
    Page<Complaint> findByCategory(Complaint.Category category, Pageable pageable);
    Page<Complaint> findByPriority(Complaint.Priority priority, Pageable pageable);
    long countByAssignedWorker(User worker);
    long countByAssignedWorkerAndStatusIn(User worker, java.util.List<Complaint.Status> statuses);
    long countByDeadlineBeforeAndStatusNotIn(java.time.LocalDateTime deadline, java.util.List<Complaint.Status> statuses);
    long countByCategory(Complaint.Category category);
    long countByPriority(Complaint.Priority priority);
    List<Complaint> findTop5ByCitizenOrderByCreatedAtDesc(User citizen);
}
