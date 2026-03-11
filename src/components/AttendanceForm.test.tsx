// blank-name error + trimmed submit

// AttendanceForm shows validation error when name is blank
// AttendanceForm calls onSubmit with trimmed name and status

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AttendanceForm from './AttendanceForm';

describe('AttendanceForm', () => {
  it('shows validation error when name is blank', () => {
    const onSubmit = vi.fn();
    render(<AttendanceForm onSubmit={onSubmit} />);

    fireEvent.click(screen.getByText('Add Attendance'));

    expect(screen.getByText('Student name is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with trimmed name and status', () => {
    const onSubmit = vi.fn();
    render(<AttendanceForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Student Name'), { target: { value: '    ' } });
    fireEvent.click(screen.getByText('Add Attendance'));

    expect(onSubmit).toHaveBeenCalledWith('Alice', 'present');
  });
});