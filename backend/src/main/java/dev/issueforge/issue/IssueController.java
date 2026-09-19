package dev.issueforge.issue;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    private final IssueService service;

    public IssueController(IssueService service) {
        this.service = service;
    }

    @GetMapping
    public List<IssueResponse> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) IssueStatus status,
            @RequestParam(required = false) Severity severity
    ) {
        return service.findAll(q, status, severity);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IssueResponse create(@Valid @RequestBody IssueRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public IssueResponse update(
            @PathVariable Long id,
            @Valid @RequestBody IssueRequest request
    ) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/stats")
    public IssueStats stats() {
        return service.stats();
    }
}
