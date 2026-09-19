package dev.issueforge.issue;

import java.time.Instant;

public record IssueResponse(
        Long id,
        String title,
        String component,
        IssueStatus status,
        Severity severity,
        Priority priority,
        String reporter,
        String environment,
        String description,
        String reproductionSteps,
        Instant createdAt,
        Instant updatedAt
) {
    static IssueResponse from(Issue issue) {
        return new IssueResponse(
                issue.getId(),
                issue.getTitle(),
                issue.getComponent(),
                issue.getStatus(),
                issue.getSeverity(),
                issue.getPriority(),
                issue.getReporter(),
                issue.getEnvironment(),
                issue.getDescription(),
                issue.getReproductionSteps(),
                issue.getCreatedAt(),
                issue.getUpdatedAt()
        );
    }
}
