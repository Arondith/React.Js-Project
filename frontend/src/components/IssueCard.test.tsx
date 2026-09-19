import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { IssueCard } from './IssueCard'
import type { Issue } from '../types'

const issue: Issue = {
  id: 17,
  title: 'Checkout button freezes',
  component: 'Checkout',
  status: 'READY_FOR_TEST',
  severity: 'HIGH',
  priority: 'URGENT',
  reporter: 'QA Engineer',
  environment: 'Chrome / Windows 11',
  description: 'The payment action stops responding.',
  reproductionSteps: '1. Open checkout\n2. Click Pay',
  createdAt: '2026-09-19T00:00:00Z',
  updatedAt: '2026-09-19T00:00:00Z',
}

describe('IssueCard', () => {
  it('renders issue details and QA metadata', () => {
    render(
      <IssueCard
        issue={issue}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    expect(screen.getByText('Checkout button freezes')).toBeInTheDocument()
    expect(screen.getByText('Ready for Test')).toBeInTheDocument()
    expect(screen.getByText('HIGH severity')).toBeInTheDocument()
    expect(screen.getByText('Chrome / Windows 11')).toBeInTheDocument()
  })
})
