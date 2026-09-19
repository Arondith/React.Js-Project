import type {
  Issue,
  IssueFilters,
  IssueInput,
  IssueStats,
} from './types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers)
  headers.set('Content-Type', 'application/json')

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let message = 'Request failed'

    try {
      const payload = (await response.json()) as { error?: string }
      message = payload.error || message
    } catch {
      // Preserve the generic message for non-JSON errors.
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

function issueQuery(filters: IssueFilters) {
  const params = new URLSearchParams()

  if (filters.q.trim()) params.set('q', filters.q.trim())
  if (filters.status !== 'ALL') params.set('status', filters.status)
  if (filters.severity !== 'ALL') params.set('severity', filters.severity)

  const query = params.toString()
  return query ? `?${query}` : ''
}

export const api = {
  listIssues(filters: IssueFilters): Promise<Issue[]> {
    return request<Issue[]>(`/api/issues${issueQuery(filters)}`)
  },

  getStats(): Promise<IssueStats> {
    return request<IssueStats>('/api/issues/stats')
  },

  createIssue(payload: IssueInput): Promise<Issue> {
    return request<Issue>('/api/issues', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  updateIssue(id: number, payload: IssueInput): Promise<Issue> {
    return request<Issue>(`/api/issues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  deleteIssue(id: number): Promise<void> {
    return request<void>(`/api/issues/${id}`, {
      method: 'DELETE',
    })
  },
}
