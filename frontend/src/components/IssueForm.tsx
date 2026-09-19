import { useEffect, useState } from 'react'
import type {
  Issue,
  IssueInput,
  IssueStatus,
  Priority,
  Severity,
} from '../types'

interface IssueFormProps {
  issue?: Issue | null
  saving: boolean
  onSave: (payload: IssueInput) => void
  onCancel: () => void
}

const statuses: Array<{ value: IssueStatus; label: string }> = [
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'READY_FOR_TEST', label: 'Ready for Test' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
]

const severities: Severity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const priorities: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

const blankIssue = (): IssueInput => ({
  title: '',
  component: '',
  status: 'OPEN',
  severity: 'MEDIUM',
  priority: 'MEDIUM',
  reporter: '',
  environment: '',
  description: '',
  reproductionSteps: '',
})

export function IssueForm({
  issue,
  saving,
  onSave,
  onCancel,
}: IssueFormProps) {
  const [form, setForm] = useState<IssueInput>(blankIssue())
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (issue) {
      const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...input } = issue
      setForm(input)
    } else {
      setForm(blankIssue())
    }
    setSubmitted(false)
  }, [issue])

  const set = <K extends keyof IssueInput>(key: K, value: IssueInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const requiredValues = [
    form.title,
    form.component,
    form.reporter,
    form.environment,
    form.description,
    form.reproductionSteps,
  ]

  function submit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitted(true)

    if (requiredValues.some((value) => !value.trim())) return

    onSave({
      ...form,
      title: form.title.trim(),
      component: form.component.trim(),
      reporter: form.reporter.trim(),
      environment: form.environment.trim(),
      description: form.description.trim(),
      reproductionSteps: form.reproductionSteps.trim(),
    })
  }

  return (
    <form className="issue-form" onSubmit={submit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">{issue ? 'EDIT ISSUE' : 'NEW ISSUE'}</p>
          <h2>{issue ? 'Update issue' : 'Report an issue'}</h2>
        </div>
        <button type="button" className="ghost-button" onClick={onCancel}>
          Close
        </button>
      </div>

      <div className="form-grid">
        <label className="full-width">
          <span>Title *</span>
          <input
            value={form.title}
            onChange={(event) => set('title', event.target.value)}
            placeholder="Checkout button freezes after payment selection"
          />
          {submitted && !form.title.trim() && <small>Title is required.</small>}
        </label>

        <label>
          <span>Component *</span>
          <input
            value={form.component}
            onChange={(event) => set('component', event.target.value)}
            placeholder="Checkout"
          />
          {submitted && !form.component.trim() && (
            <small>Component is required.</small>
          )}
        </label>

        <label>
          <span>Reporter *</span>
          <input
            value={form.reporter}
            onChange={(event) => set('reporter', event.target.value)}
            placeholder="QA Engineer"
          />
          {submitted && !form.reporter.trim() && (
            <small>Reporter is required.</small>
          )}
        </label>

        <label>
          <span>Status</span>
          <select
            value={form.status}
            onChange={(event) => set('status', event.target.value as IssueStatus)}
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Severity</span>
          <select
            value={form.severity}
            onChange={(event) => set('severity', event.target.value as Severity)}
          >
            {severities.map((severity) => (
              <option key={severity} value={severity}>
                {severity}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Priority</span>
          <select
            value={form.priority}
            onChange={(event) => set('priority', event.target.value as Priority)}
          >
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Environment *</span>
          <input
            value={form.environment}
            onChange={(event) => set('environment', event.target.value)}
            placeholder="Chrome 131 / Windows 11"
          />
          {submitted && !form.environment.trim() && (
            <small>Environment is required.</small>
          )}
        </label>

        <label className="full-width">
          <span>Description *</span>
          <textarea
            rows={4}
            value={form.description}
            onChange={(event) => set('description', event.target.value)}
            placeholder="Describe the observed behavior and expected result."
          />
          {submitted && !form.description.trim() && (
            <small>Description is required.</small>
          )}
        </label>

        <label className="full-width">
          <span>Reproduction steps *</span>
          <textarea
            rows={6}
            value={form.reproductionSteps}
            onChange={(event) => set('reproductionSteps', event.target.value)}
            placeholder={'1. Sign in\n2. Add an item\n3. Open checkout\n4. ...'}
          />
          {submitted && !form.reproductionSteps.trim() && (
            <small>Reproduction steps are required.</small>
          )}
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="ghost-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-button" disabled={saving}>
          {saving ? 'Saving…' : issue ? 'Save changes' : 'Create issue'}
        </button>
      </div>
    </form>
  )
}
