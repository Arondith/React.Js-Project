export type IssueStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'READY_FOR_TEST'
  | 'RESOLVED'
  | 'CLOSED'

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface IssueInput {
  title: string
  component: string
  status: IssueStatus
  severity: Severity
  priority: Priority
  reporter: string
  environment: string
  description: string
  reproductionSteps: string
}

export interface Issue extends IssueInput {
  id: number
  createdAt: string
  updatedAt: string
}

export interface IssueStats {
  total: number
  open: number
  active: number
  resolved: number
  critical: number
}

export interface IssueFilters {
  q: string
  status: IssueStatus | 'ALL'
  severity: Severity | 'ALL'
}
