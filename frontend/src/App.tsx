import { useState } from 'react'
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { api } from './api'
import { IssueCard } from './components/IssueCard'
import { IssueForm } from './components/IssueForm'
import type {
  Issue,
  IssueFilters,
  IssueInput,
  IssueStatus,
  Severity,
} from './types'

const statusOptions: Array<{ value: IssueStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'READY_FOR_TEST', label: 'Ready for Test' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
]

const severityOptions: Array<Severity | 'ALL'> = [
  'ALL',
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
]

export default function App() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<IssueFilters>({
    q: '',
    status: 'ALL',
    severity: 'ALL',
  })
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Issue | null>(null)
  const [error, setError] = useState('')

  const issuesQuery = useQuery({
    queryKey: ['issues', filters],
    queryFn: () => api.listIssues(filters),
  })

  const statsQuery = useQuery({
    queryKey: ['issue-stats'],
    queryFn: api.getStats,
  })

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['issues'] }),
      queryClient.invalidateQueries({ queryKey: ['issue-stats'] }),
    ])
  }

  const saveMutation = useMutation({
    mutationFn: (payload: IssueInput) =>
      editing
        ? api.updateIssue(editing.id, payload)
        : api.createIssue(payload),
    onSuccess: async () => {
      closeForm()
      setError('')
      await refresh()
    },
    onError: (reason) => {
      setError(reason instanceof Error ? reason.message : 'Unable to save issue.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: api.deleteIssue,
    onSuccess: refresh,
    onError: (reason) => {
      setError(reason instanceof Error ? reason.message : 'Unable to delete issue.')
    },
  })

  const issues = issuesQuery.data ?? []
  const stats = statsQuery.data ?? {
    total: 0,
    open: 0,
    active: 0,
    resolved: 0,
    critical: 0,
  }

  function startCreate() {
    setEditing(null)
    setShowForm(true)
    setError('')
  }

  function startEdit(issue: Issue) {
    setEditing(issue)
    setShowForm(true)
    setError('')
  }

  function closeForm() {
    setEditing(null)
    setShowForm(false)
  }

  function removeIssue(id: number) {
    if (window.confirm('Delete this issue?')) {
      deleteMutation.mutate(id)
    }
  }

  const loading = issuesQuery.isLoading || statsQuery.isLoading
  const queryError =
    issuesQuery.error instanceof Error
      ? issuesQuery.error.message
      : statsQuery.error instanceof Error
        ? statsQuery.error.message
        : ''

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-mark">IF</span>
          <span>IssueForge</span>
        </a>

        <button className="primary-button" type="button" onClick={startCreate}>
          + Report issue
        </button>
      </header>

      <section className="hero">
        <p className="eyebrow">ENGINEERING QUALITY WORKSPACE</p>
        <h1>Turn defects into clear next actions.</h1>
        <p>
          Capture reproducible bugs, prioritize impact, and move issues from discovery
          through verification without losing context.
        </p>
      </section>

      <section className="stats-grid" aria-label="Issue statistics">
        <article>
          <span>Total issues</span>
          <strong>{stats.total}</strong>
        </article>
        <article>
          <span>Open</span>
          <strong>{stats.open}</strong>
        </article>
        <article>
          <span>Active / testing</span>
          <strong>{stats.active}</strong>
        </article>
        <article>
          <span>Resolved</span>
          <strong>{stats.resolved}</strong>
        </article>
        <article>
          <span>Critical</span>
          <strong>{stats.critical}</strong>
        </article>
      </section>

      <section className="workspace">
        <div className="workspace-heading">
          <div>
            <p className="eyebrow">ISSUE QUEUE</p>
            <h2>Defects and engineering tasks</h2>
          </div>
          <span>{issues.length} shown</span>
        </div>

        <div className="toolbar">
          <input
            className="search-input"
            type="search"
            value={filters.q}
            onChange={(event) =>
              setFilters((current) => ({ ...current, q: event.target.value }))
            }
            placeholder="Search title, component, reporter..."
          />

          <div className="filter-row">
            <select
              value={filters.status}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  status: event.target.value as IssueStatus | 'ALL',
                }))
              }
              aria-label="Filter by status"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={filters.severity}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  severity: event.target.value as Severity | 'ALL',
                }))
              }
              aria-label="Filter by severity"
            >
              {severityOptions.map((severity) => (
                <option key={severity} value={severity}>
                  {severity === 'ALL' ? 'All severities' : severity}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(error || queryError) && (
          <p className="error-banner">{error || queryError}</p>
        )}

        {loading ? (
          <div className="empty-state">
            <strong>Loading engineering queue…</strong>
          </div>
        ) : issues.length ? (
          <div className="issue-list">
            {issues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onEdit={startEdit}
                onDelete={removeIssue}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <strong>No matching issues.</strong>
            <p>Change the filters or report the first issue for this queue.</p>
            <button className="primary-button" type="button" onClick={startCreate}>
              Report an issue
            </button>
          </div>
        )}
      </section>

      {showForm && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.currentTarget === event.target) closeForm()
        }}>
          <div className="modal">
            <IssueForm
              issue={editing}
              saving={saveMutation.isPending}
              onSave={(payload) => saveMutation.mutate(payload)}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}
    </main>
  )
}
