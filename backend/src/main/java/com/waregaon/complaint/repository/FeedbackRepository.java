package com.waregaon.complaint.repository;

import com.waregaon.complaint.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Optional<Feedback> findByComplaintId(Long complaintId);
    Optional<Feedback> findByUserIdAndComplaintId(Long userId, Long complaintId);
    @Query("SELECT AVG(f.rating) FROM Feedback f")
    Double getAverageRating();
}
