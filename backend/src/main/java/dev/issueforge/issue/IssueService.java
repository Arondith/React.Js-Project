package dev.issueforge.issue;

import dev.issueforge.shared.NotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IssueService {

    private final IssueRepository repository;

    public IssueService(IssueRepository repository) {
        this.repository = repository;
    }

    public List<IssueResponse> findAll(String query, IssueStatus status, Severity severity) {
        Specification<Issue> spec = Specification.where(null);

        if (query != null && !query.isBlank()) {
            String pattern = "%" + query.trim().toLowerCase() + "%";
            spec = spec.and((root, criteriaQuery, builder) -> builder.or(
                    builder.like(builder.lower(root.get("title")), pattern),
                    builder.like(builder.lower(root.get("component")), pattern),
                    builder.like(builder.lower(root.get("reporter")), pattern)
            ));
        }

        if (status != null) {
            spec = spec.and((root, criteriaQuery, builder) ->
                    builder.equal(root.get("status"), status));
        }

        if (severity != null) {
            spec = spec.and((root, criteriaQuery, builder) ->
                    builder.equal(root.get("severity"), severity));
        }

        return repository.findAll(spec, Sort.by(Sort.Direction.DESC, "updatedAt"))
                .stream()
                .map(IssueResponse::from)
                .toList();
    }

    public IssueResponse create(IssueRequest request) {
        Issue issue = new Issue();
        apply(issue, request);
        return IssueResponse.from(repository.save(issue));
    }

    public IssueResponse update(Long id, IssueRequest request) {
        Issue issue = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Issue not found"));
        apply(issue, request);
        return IssueResponse.from(repository.save(issue));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Issue not found");
        }
        repository.deleteById(id);
    }

    public IssueStats stats() {
        List<Issue> issues = repository.findAll();

        long open = issues.stream()
                .filter(issue -> issue.getStatus() == IssueStatus.OPEN)
                .count();
        long active = issues.stream()
                .filter(issue -> issue.getStatus() == IssueStatus.IN_PROGRESS
                        || issue.getStatus() == IssueStatus.READY_FOR_TEST)
                .count();
        long resolved = issues.stream()
                .filter(issue -> issue.getStatus() == IssueStatus.RESOLVED
                        || issue.getStatus() == IssueStatus.CLOSED)
                .count();
        long critical = issues.stream()
                .filter(issue -> issue.getSeverity() == Severity.CRITICAL)
                .count();

        return new IssueStats(issues.size(), open, active, resolved, critical);
    }

    private void apply(Issue issue, IssueRequest request) {
        issue.setTitle(request.title().trim());
        issue.setComponent(request.component().trim());
        issue.setStatus(request.status());
        issue.setSeverity(request.severity());
        issue.setPriority(request.priority());
        issue.setReporter(request.reporter().trim());
        issue.setEnvironment(request.environment().trim());
        issue.setDescription(request.description().trim());
        issue.setReproductionSteps(request.reproductionSteps().trim());
    }
}
