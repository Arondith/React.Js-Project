import type { Issue } from '../types'

interface IssueCardProps {
  issue: Issue
  onEdit: (issue: Issue) => void
  onDelete: (id: number) => void
}

const statusLabels: Record<Issue['status'], string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  READY_FOR_TEST: 'Ready for Test',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function IssueCard({ issue, onEdit, onDelete }: IssueCardProps) {
  return (
    <article className="issue-card">
      <div className="issue-card__top">
        <div>
          <div className="issue-title-line">
            <span className="issue-id">#{issue.id}</span>
            <h3>{issue.title}</h3>
          </div>
          <p className="issue-component">{issue.component}</p>
        </div>

        <div className="issue-actions">
          <button type="button" className="small-button" onClick={() => onEdit(issue)}>
            Edit
          </button>
          <button
            type="button"
            className="small-button danger"
            onClick={() => onDelete(issue.id)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="badge-row">
        <span className="badge status-badge" data-status={issue.status}>
          {statusLabels[issue.status]}
        </span>
        <span className="badge severity-badge" data-severity={issue.severity}>
          {issue.severity} severity
        </span>
        <span className="badge priority-badge">
          {issue.priority} priority
        </span>
      </div>

      <p className="issue-description">{issue.description}</p>

      <dl className="issue-meta">
        <div>
          <dt>Reporter</dt>
          <dd>{issue.reporter}</dd>
        </div>
        <div>
          <dt>Environment</dt>
          <dd>{issue.environment}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>{formatDate(issue.updatedAt)}</dd>
        </div>
      </dl>

      <details className="repro-details">
        <summary>Reproduction steps</summary>
        <pre>{issue.reproductionSteps}</pre>
      </details>
    </article>
  )
}
