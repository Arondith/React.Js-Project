package dev.issueforge.issue;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record IssueRequest(
        @NotBlank @Size(max = 180) String title,
        @NotBlank @Size(max = 80) String component,
        @NotNull IssueStatus status,
        @NotNull Severity severity,
        @NotNull Priority priority,
        @NotBlank @Size(max = 120) String reporter,
        @NotBlank @Size(max = 160) String environment,
        @NotBlank @Size(max = 4000) String description,
        @NotBlank @Size(max = 4000) String reproductionSteps
) {
}
