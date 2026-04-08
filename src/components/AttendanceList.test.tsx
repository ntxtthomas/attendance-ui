import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AttendanceList from './AttendanceList';
import type { AttendanceEntry } from '../types';

describe('AttendanceList', () => {

  const baseProps = {
    editDraft: null,
    onEditStudentNameChange: () => {},
    onEditStatusChange: () => {},
    onEdit: () => {},
    onSaveEdit: () => {},
    onCancel: () => {},
    onDelete: () => {},
  };  

  it('renders attendance entries correctly', () => {
    const entries: AttendanceEntry[] = [
      { id: '1', studentName: 'Alice', status: 'present', recordedAt: '2024-01-01T08:00:00Z' },
      { id: '2', studentName: 'Bob', status: 'absent', recordedAt: '2024-01-01T08:05:00Z' },
    ];

    render(<AttendanceList 
        entries={entries}
        {...baseProps}
      />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText(/present/i)).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText(/absent/i)).toBeInTheDocument();
  });
    it ('calls onDelete callback when delete button is clicked', () => {
    const entries: AttendanceEntry[] = [
      { id: '1', studentName: 'Alice', status: 'present', recordedAt: '2024-01-01T08:00:00Z' },
    ];
    const onDelete = vi.fn();
    render(<AttendanceList 
        entries={entries}
        {...baseProps}
        onDelete={onDelete}
      />);

    screen.getByText('Delete').click();
    expect(onDelete).toHaveBeenCalledWith('1');
  });
    it('renders edit mode row when editingId matches entry id', () => {
    const entries: AttendanceEntry[] = [
      { id: '1', studentName: 'Alice', status: 'present', recordedAt: '2024-01-01T08:00:00Z' },
    ];
    render(
      <AttendanceList 
        entries={entries}
        {...baseProps}
        editDraft={{ 
          id: '1', 
          studentName: 'Alice', 
          status: 'present', 
          recordedAt: '2024-01-01T08:00:00Z' 
        }}
      />
    );

    expect(screen.getByRole('textbox')).toHaveValue('Alice');
    expect(screen.getByRole('combobox')).toHaveValue('present');
  });
});
