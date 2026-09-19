package dev.issueforge.issue;

public record IssueStats(
        long total,
        long open,
        long active,
        long resolved,
        long critical
) {
}
