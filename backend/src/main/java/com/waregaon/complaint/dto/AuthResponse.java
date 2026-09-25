package com.waregaon.complaint.dto;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String fullName;
    private String role;

    public AuthResponse() {}

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final AuthResponse r = new AuthResponse();

        public Builder token(String token) { r.token = token; return this; }
        public Builder id(Long id) { r.id = id; return this; }
        public Builder email(String email) { r.email = email; return this; }
        public Builder fullName(String fullName) { r.fullName = fullName; return this; }
        public Builder role(String role) { r.role = role; return this; }

        public AuthResponse build() { return r; }
    }
}
