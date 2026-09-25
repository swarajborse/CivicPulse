package com.waregaon.complaint.dto;

import java.util.List;

public class PageResponse<T> {
    private List<T> content;
    private int totalPages;
    private long totalElements;
    private int currentPage;

    public PageResponse() {}

    public PageResponse(List<T> content, int totalPages, long totalElements, int currentPage) {
        this.content = content;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.currentPage = currentPage;
    }

    public List<T> getContent() { return content; }
    public void setContent(List<T> content) { this.content = content; }
    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }
    public long getTotalElements() { return totalElements; }
    public void setTotalElements(long totalElements) { this.totalElements = totalElements; }
    public int getCurrentPage() { return currentPage; }
    public void setCurrentPage(int currentPage) { this.currentPage = currentPage; }

    public static <T> Builder<T> builder() { return new Builder<>(); }

    public static class Builder<T> {
        private final PageResponse<T> p = new PageResponse<>();

        public Builder<T> content(List<T> content) { p.content = content; return this; }
        public Builder<T> totalPages(int totalPages) { p.totalPages = totalPages; return this; }
        public Builder<T> totalElements(long totalElements) { p.totalElements = totalElements; return this; }
        public Builder<T> currentPage(int currentPage) { p.currentPage = currentPage; return this; }

        public PageResponse<T> build() { return p; }
    }
}
