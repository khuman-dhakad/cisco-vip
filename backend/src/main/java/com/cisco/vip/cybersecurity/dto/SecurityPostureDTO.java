package com.cisco.vip.cybersecurity.dto;

import java.util.List;
import java.util.Map;

public class SecurityPostureDTO {
    private int score; // 0 to 100
    private String grade; // "A+", "A", "B", "C", "D", "F"
    private String statusSummary;
    private Map<String, Integer> categoryScores; // "IAM_MFA", "MICROSEGMENTATION", "FIREWALL_HEALTH", "WORKLOAD_HYGIENE", "HYBRID_LINK_INTEGRITY", "INCIDENT_IMPACT"
    private List<PostureFactor> positiveFactors;
    private List<PostureFactor> negativeFactors;
    private List<String> recommendations;

    public static class PostureFactor {
        private String name;
        private int impact; // e.g. +15, -20
        private String description;
        private String category;

        public PostureFactor() {
        }

        public PostureFactor(String name, int impact, String description, String category) {
            this.name = name;
            this.impact = impact;
            this.description = description;
            this.category = category;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getImpact() {
            return impact;
        }

        public void setImpact(int impact) {
            this.impact = impact;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }
    }

    public SecurityPostureDTO() {
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getStatusSummary() {
        return statusSummary;
    }

    public void setStatusSummary(String statusSummary) {
        this.statusSummary = statusSummary;
    }

    public Map<String, Integer> getCategoryScores() {
        return categoryScores;
    }

    public void setCategoryScores(Map<String, Integer> categoryScores) {
        this.categoryScores = categoryScores;
    }

    public List<PostureFactor> getPositiveFactors() {
        return positiveFactors;
    }

    public void setPositiveFactors(List<PostureFactor> positiveFactors) {
        this.positiveFactors = positiveFactors;
    }

    public List<PostureFactor> getNegativeFactors() {
        return negativeFactors;
    }

    public void setNegativeFactors(List<PostureFactor> negativeFactors) {
        this.negativeFactors = negativeFactors;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }
}
