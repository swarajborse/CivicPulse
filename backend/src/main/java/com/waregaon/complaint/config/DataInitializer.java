package com.waregaon.complaint.config;

import com.waregaon.complaint.entity.*;
import com.waregaon.complaint.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private ComplaintRepository complaintRepository;
    @Autowired private ComplaintUpdateRepository updateRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            createUsers();
            createComplaints();
        }
    }

    private void createUsers() {
        // Admin
        userRepository.save(createUser("Suresh Deshmukh", "admin@waregaon.gov.in", "9876543210", "admin123", User.Role.ADMIN, "Waregaon", "Main Square, Waregaon"));

        // Workers
        userRepository.save(createUser("Ramesh Patil", "ramesh@waregaon.gov.in", "9876543211", "worker123", User.Role.WORKER, "Waregaon", "Ward 3, Waregaon"));
        userRepository.save(createUser("Suresh Jadhav", "suresh@waregaon.gov.in", "9876543212", "worker123", User.Role.WORKER, "Waregaon", "Ward 5, Waregaon"));
        userRepository.save(createUser("Prakash More", "prakash@waregaon.gov.in", "9876543213", "worker123", User.Role.WORKER, "Waregaon", "Ward 7, Waregaon"));

        // Citizens
        userRepository.save(createUser("Priya Deshmukh", "priya@example.com", "9876543220", "citizen123", User.Role.CITIZEN, "Waregaon", "Near Bus Stand, Waregaon"));
        userRepository.save(createUser("Amit Shirke", "amit@example.com", "9876543221", "citizen123", User.Role.CITIZEN, "Waregaon", "Ward 2, Waregaon"));
        userRepository.save(createUser("Neha Kulkarni", "neha@example.com", "9876543222", "citizen123", User.Role.CITIZEN, "Waregaon", "Temple Road, Waregaon"));
        userRepository.save(createUser("Rahul Jogale", "rahul@example.com", "9876543223", "citizen123", User.Role.CITIZEN, "Ashti", "Near School, Ashti"));
        userRepository.save(createUser("Sneha Bhosale", "sneha@example.com", "9876543224", "citizen123", User.Role.CITIZEN, "Waregaon", "Ward 6, Waregaon"));
    }

    private User createUser(String name, String email, String phone, String pass, User.Role role, String village, String address) {
        User u = new User();
        u.setFullName(name);
        u.setEmail(email);
        u.setPhone(phone);
        u.setPassword(passwordEncoder.encode(pass));
        u.setRole(role);
        u.setEnabled(true);
        u.setVillage(village);
        u.setAddress(address);
        return u;
    }

    private void createComplaints() {
        User c1 = userRepository.findByEmail("priya@example.com").orElse(null);
        User c2 = userRepository.findByEmail("amit@example.com").orElse(null);
        User c3 = userRepository.findByEmail("neha@example.com").orElse(null);
        User c4 = userRepository.findByEmail("rahul@example.com").orElse(null);
        User c5 = userRepository.findByEmail("sneha@example.com").orElse(null);
        User w1 = userRepository.findByEmail("ramesh@waregaon.gov.in").orElse(null);
        User w2 = userRepository.findByEmail("suresh@waregaon.gov.in").orElse(null);

        // PENDING complaints
        saveComplaint("Pothole on Main Road", "Large pothole near bus stop causing accidents", Complaint.Category.ROAD, Complaint.Priority.HIGH, Complaint.Status.PENDING, "Near Bus Stop, Main Road, Waregaon", c1);
        saveComplaint("Water Leakage", "Water pipe burst near school causing water wastage", Complaint.Category.WATER, Complaint.Priority.URGENT, Complaint.Status.PENDING, "Near Primary School, Waregaon", c2);
        saveComplaint("Street Light Not Working", "Street light near temple area not working for a week", Complaint.Category.STREET_LIGHT, Complaint.Priority.MEDIUM, Complaint.Status.PENDING, "Temple Road, Waregaon", c3);
        saveComplaint("Garbage Dump", "Illegal garbage dump on road corner creating卫生问题", Complaint.Category.GARBAGE, Complaint.Priority.HIGH, Complaint.Status.PENDING, "Ward 4 Corner, Waregaon", c4);

        // ASSIGNED complaints
        saveComplaint("Drainage Overflow", "Drainage overflowing during rain, water entering homes", Complaint.Category.DRAINAGE, Complaint.Priority.HIGH, Complaint.Status.ASSIGNED, "Ward 3, Waregaon", c1, w1);
        saveComplaint("Broken Footpath", "Footpath tiles broken near market area", Complaint.Category.OTHER, Complaint.Priority.LOW, Complaint.Status.ASSIGNED, "Market Area, Waregaon", c5, w2);
        saveComplaint("Power Outage", "Frequent power cuts in evening hours", Complaint.Category.ELECTRICITY, Complaint.Priority.HIGH, Complaint.Status.ASSIGNED, "Ward 5, Waregaon", c2, w1);

        // IN_PROGRESS complaints
        saveComplaint("Road Repair Needed", "Road completely damaged after monsoon", Complaint.Category.ROAD, Complaint.Priority.URGENT, Complaint.Status.IN_PROGRESS, "Main Road to School, Waregaon", c3, w1);
        saveComplaint("Water Supply Issue", "No water supply for 2 days in the area", Complaint.Category.WATER, Complaint.Priority.HIGH, Complaint.Status.IN_PROGRESS, "Ward 6, Waregaon", c4, w2);

        // RESOLVED complaints
        saveComplaint("Street Light Fixed", "Street light repaired and working", Complaint.Category.STREET_LIGHT, Complaint.Priority.MEDIUM, Complaint.Status.RESOLVED, "Ward 1, Waregaon", c5, w1);
        saveComplaint("Garbage Cleared", "Garbage collection regularized", Complaint.Category.GARBAGE, Complaint.Priority.LOW, Complaint.Status.RESOLVED, "Ward 2, Waregaon", c1, w2);
        saveComplaint("Drainage Cleaned", "Drainage cleaned and flow restored", Complaint.Category.DRAINAGE, Complaint.Priority.MEDIUM, Complaint.Status.RESOLVED, "Main Road, Waregaon", c3, w1);

        // CLOSED complaints
        saveComplaint("Electricity Pole Fixed", "Damaged electricity pole replaced", Complaint.Category.ELECTRICITY, Complaint.Priority.HIGH, Complaint.Status.CLOSED, "Near Temple, Waregaon", c2, w2);
        saveComplaint("Road Pothole Filled", "Pothole filled and road levelled", Complaint.Category.ROAD, Complaint.Priority.MEDIUM, Complaint.Status.CLOSED, "Market Road, Waregaon", c4, w1);

        // More variety
        saveComplaint("Public Safety Concern", "Stray animals causing trouble near school", Complaint.Category.PUBLIC_SAFETY, Complaint.Priority.HIGH, Complaint.Status.PENDING, "Near School Gate, Waregaon", c5);
        saveComplaint("Drainage Blockage", "Storm drain blocked causing waterlogging", Complaint.Category.DRAINAGE, Complaint.Priority.URGENT, Complaint.Status.ASSIGNED, "Ward 4, Waregaon", c1, w1);
        saveComplaint("Park Maintenance", "Park equipment broken and needs repair", Complaint.Category.OTHER, Complaint.Priority.LOW, Complaint.Status.IN_PROGRESS, "Community Park, Waregaon", c3, w2);
        saveComplaint("Water Tank Cleaning", "Overhead water tank needs cleaning", Complaint.Category.WATER, Complaint.Priority.MEDIUM, Complaint.Status.PENDING, "Water Tank Road, Waregaon", c2);
        saveComplaint("Road Marking", "Road marking faded at main intersection", Complaint.Category.ROAD, Complaint.Priority.LOW, Complaint.Status.RESOLVED, "Main Intersection, Waregaon", c4, w1);
        saveComplaint("Street Light Installation", "New street light needed in dark area", Complaint.Category.STREET_LIGHT, Complaint.Priority.MEDIUM, Complaint.Status.CLOSED, "Back Road, Waregaon", c5, w2);
    }

    private void saveComplaint(String title, String desc, Complaint.Category cat, Complaint.Priority pri, Complaint.Status status, String location, User citizen) {
        saveComplaint(title, desc, cat, pri, status, location, citizen, null);
    }

    private void saveComplaint(String title, String desc, Complaint.Category cat, Complaint.Priority pri, Complaint.Status status, String location, User citizen, User worker) {
        Complaint c = new Complaint();
        c.setTitle(title);
        c.setDescription(desc);
        c.setCategory(cat);
        c.setPriority(pri);
        c.setLocation(location);
        c.setCitizen(citizen);
        c.setCitizenName(citizen.getFullName());
        c.setCitizenPhone(citizen.getPhone());
        c.setFeedbackStatus(Complaint.FeedbackStatus.PENDING);

        long count = complaintRepository.count() + 1;
        c.setComplaintId(String.format("WGR-%d-%06d", LocalDateTime.now().getYear(), count));

        // Set deadline based on priority
        LocalDateTime now = LocalDateTime.now();
        switch (pri) {
            case URGENT: c.setDeadline(now.plusHours(24)); break;
            case HIGH: c.setDeadline(now.plusDays(3)); break;
            case MEDIUM: c.setDeadline(now.plusDays(5)); break;
            case LOW: c.setDeadline(now.plusDays(7)); break;
        }

        if (status == Complaint.Status.PENDING) {
            c.setStatus(Complaint.Status.PENDING);
        } else if (worker != null) {
            c.setAssignedWorker(worker);
            c.setAssignedWorkerName(worker.getFullName());
            if (status == Complaint.Status.ASSIGNED) {
                c.setStatus(Complaint.Status.ASSIGNED);
            } else if (status == Complaint.Status.IN_PROGRESS) {
                c.setStatus(Complaint.Status.IN_PROGRESS);
            } else if (status == Complaint.Status.RESOLVED) {
                c.setStatus(Complaint.Status.RESOLVED);
                c.setResolvedAt(now.minusDays(1));
            } else if (status == Complaint.Status.CLOSED) {
                c.setStatus(Complaint.Status.CLOSED);
                c.setResolvedAt(now.minusDays(5));
            }
        }

        complaintRepository.save(c);

        // Add timeline entries for non-pending complaints
        if (status != Complaint.Status.PENDING && worker != null) {
            ComplaintUpdate assignUpdate = new ComplaintUpdate();
            assignUpdate.setComplaint(c);
            assignUpdate.setUpdatedBy(userRepository.findByEmail("admin@waregaon.gov.in").orElse(null));
            assignUpdate.setPreviousStatus(Complaint.Status.PENDING);
            assignUpdate.setNewStatus(Complaint.Status.ASSIGNED);
            assignUpdate.setRemarks("Assigned to " + worker.getFullName());
            updateRepository.save(assignUpdate);

            if (status == Complaint.Status.IN_PROGRESS || status == Complaint.Status.RESOLVED || status == Complaint.Status.CLOSED) {
                ComplaintUpdate startUpdate = new ComplaintUpdate();
                startUpdate.setComplaint(c);
                startUpdate.setUpdatedBy(worker);
                startUpdate.setPreviousStatus(Complaint.Status.ASSIGNED);
                startUpdate.setNewStatus(Complaint.Status.IN_PROGRESS);
                startUpdate.setRemarks("Work started");
                updateRepository.save(startUpdate);
            }
            if (status == Complaint.Status.RESOLVED || status == Complaint.Status.CLOSED) {
                ComplaintUpdate resolveUpdate = new ComplaintUpdate();
                resolveUpdate.setComplaint(c);
                resolveUpdate.setUpdatedBy(worker);
                resolveUpdate.setPreviousStatus(Complaint.Status.IN_PROGRESS);
                resolveUpdate.setNewStatus(Complaint.Status.RESOLVED);
                resolveUpdate.setRemarks("Work completed successfully");
                updateRepository.save(resolveUpdate);
            }
            if (status == Complaint.Status.CLOSED) {
                ComplaintUpdate closeUpdate = new ComplaintUpdate();
                closeUpdate.setComplaint(c);
                closeUpdate.setUpdatedBy(userRepository.findByEmail("priya@example.com").orElse(null));
                closeUpdate.setPreviousStatus(Complaint.Status.RESOLVED);
                closeUpdate.setNewStatus(Complaint.Status.CLOSED);
                closeUpdate.setRemarks("Verified and closed");
                updateRepository.save(closeUpdate);
            }
        }
    }
}
