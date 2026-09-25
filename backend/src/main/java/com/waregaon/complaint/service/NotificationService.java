package com.waregaon.complaint.service;

import com.waregaon.complaint.dto.NotificationResponse;
import com.waregaon.complaint.entity.User;
import com.waregaon.complaint.repository.NotificationRepository;
import com.waregaon.complaint.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private UserRepository userRepository;

    public List<NotificationResponse> getNotifications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(n -> {
                    NotificationResponse r = new NotificationResponse();
                    r.setId(n.getId());
                    r.setTitle(n.getTitle());
                    r.setMessage(n.getMessage());
                    r.setType(n.getType());
                    r.setComplaintId(n.getComplaintId());
                    r.setRead(n.isRead());
                    r.setCreatedAt(n.getCreatedAt());
                    return r;
                }).collect(Collectors.toList());
    }

    public long getUnreadCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.countByUserIdAndReadFalse(user.getId());
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        var notif = notificationRepository.findById(notificationId).orElse(null);
        if (notif != null) {
            notif.setRead(true);
            notificationRepository.save(notif);
        }
    }

    @Transactional
    public void markAllAsRead(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .forEach(n -> { n.setRead(true); notificationRepository.save(n); });
    }
}
