package com.waregaon.complaint.repository;

import com.waregaon.complaint.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    java.util.List<User> findByRole(User.Role role);
    java.util.List<User> findByRoleAndEnabled(User.Role role, boolean enabled);
}
