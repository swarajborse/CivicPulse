package com.waregaon.complaint.dto;

public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String role;
    private boolean enabled;
    private String village;
    private String address;
    private String avatarUrl;
    private long activeComplaintCount;

    public UserResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public long getActiveComplaintCount() { return activeComplaintCount; }
    public void setActiveComplaintCount(long activeComplaintCount) { this.activeComplaintCount = activeComplaintCount; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final UserResponse r = new UserResponse();

        public Builder id(Long id) { r.id = id; return this; }
        public Builder email(String email) { r.email = email; return this; }
        public Builder fullName(String fullName) { r.fullName = fullName; return this; }
        public Builder phone(String phone) { r.phone = phone; return this; }
        public Builder role(String role) { r.role = role; return this; }
        public Builder enabled(boolean enabled) { r.enabled = enabled; return this; }
        public Builder village(String village) { r.village = village; return this; }
        public Builder address(String address) { r.address = address; return this; }
        public Builder avatarUrl(String avatarUrl) { r.avatarUrl = avatarUrl; return this; }
        public Builder activeComplaintCount(long activeComplaintCount) { r.activeComplaintCount = activeComplaintCount; return this; }

        public UserResponse build() { return r; }
    }
}
