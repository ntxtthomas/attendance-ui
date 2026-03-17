import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AttendanceSummary from './AttendanceSummary';
import type { AttendanceEntry } from '../types';

describe('AttendanceSummary', () => {
  it('renders summary counts correctly', () => {
    const entries: AttendanceEntry[] = [
      { id: '1', studentName: 'Alice', status: 'present', recordedAt: '2024-01-01T08:00:00Z' },
      { id: '2', studentName: 'Bob', status: 'absent', recordedAt: '2024-01-01T08:05:00Z' },
      { id: '3', studentName: 'Charlie', status: 'late', recordedAt: '2024-01-01T08:10:00Z' },
      { id: '4', studentName: 'David', status: 'excused', recordedAt: '2024-01-01T08:15:00Z' },
      { id: '5', studentName: 'Eve', status: 'present', recordedAt: '2024-01-01T08:20:00Z' },
    ];

    render(<AttendanceSummary entries={entries} />);

    expect(screen.getByText(/All: 5/)).toBeInTheDocument();
    expect(screen.getByText(/Present: 2/)).toBeInTheDocument();
    expect(screen.getByText(/Absent: 1/)).toBeInTheDocument();
    expect(screen.getByText(/Late: 1/)).toBeInTheDocument();
    expect(screen.getByText(/Excused: 1/)).toBeInTheDocument();
  });
});