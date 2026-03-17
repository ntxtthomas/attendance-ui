// loading then fetched entries

// load error/retry, 
// create success, 
// delete success, 
// filtered-empty state, 
// save/update 
// success

import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AttendancePage from './AttendancePage';
import type { AttendanceEntry } from '../types';
import * as attendanceApi from '../api/attendanceApi';
import type { Mock } from 'vitest';

vi.mock('../api/attendanceApi', () => ({
  attendanceApi: {
    listEntries: vi.fn(),
    createEntry: vi.fn(),
    deleteEntry: vi.fn(),
    updateEntry: vi.fn(),
  },
}));

describe('AttendancePage', () => {

    it('renders loading state initially', () => {
        render(<AttendancePage />);
        expect(screen.getByText(/Loading attendance.../)).toBeInTheDocument();
    });

  
    it('loads and displays attendance entries', async () => {
        const mockEntries: AttendanceEntry[] = [
            { id: '1', studentName: 'Alice', status: 'present', recordedAt: '2024-01-01T08:00:00Z' },
            { id: '2', studentName: 'Bob', status: 'absent', recordedAt: '2024-01-01T08:05:00Z' },
        ];
        (attendanceApi.attendanceApi.listEntries as Mock).mockResolvedValue(mockEntries);

        render(<AttendancePage />);
    
        expect(await screen.findByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('displays load error message on fetch failure', async () => {
        (attendanceApi.attendanceApi.listEntries as Mock).mockRejectedValue(new Error('Failed to fetch'));

        render(<AttendancePage />);

        expect(await screen.findByText('Failed to load attendance entries')).toBeInTheDocument();
    });

    it('shows retry option on load failure and reloads data on retry', async () => {
        (attendanceApi.attendanceApi.listEntries as Mock)
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockResolvedValueOnce([
        { id: '1', studentName: 'Alice', status: 'present', recordedAt: '2024-01-01T08:00:00Z' },
        ]);

        render(<AttendancePage />);

        expect(await screen.findByText('Failed to load attendance entries')).toBeInTheDocument();
        const retryButton = screen.getByText(/Retry/);
        expect(retryButton).toBeInTheDocument();

        retryButton.click();

        expect(await screen.findByText('Alice')).toBeInTheDocument();
    });

    it('creates a new attendance entry successfully', async () => {
        const newEntry: AttendanceEntry = { id: '3', studentName: 'Charlie', status: 'late', recordedAt: '2024-01-01T08:10:00Z' };
        (attendanceApi.attendanceApi.createEntry as Mock).mockResolvedValue(newEntry);
        (attendanceApi.attendanceApi.listEntries as Mock).mockResolvedValue([]);

        render(<AttendancePage />);
        const addButton = await screen.findByRole('button', { name: /Add Attendance/i });

        fireEvent.change(screen.getByPlaceholderText('Student Name'), { target: { value: 'Charlie' } });
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'late' } });
        fireEvent.click(addButton);

        expect(await screen.findByText('Charlie')).toBeInTheDocument();
    });

    it('displays create error message on creation failure', async () => {
        (attendanceApi.attendanceApi.createEntry as Mock).mockRejectedValue(new Error('Failed to create'));
        (attendanceApi.attendanceApi.listEntries as Mock).mockResolvedValue([]);

        render(<AttendancePage />);
        const addButton = await screen.findByRole('button', { name: /Add Attendance/i });

        fireEvent.change(screen.getByPlaceholderText('Student Name'), { target: { value: 'Charlie' } });
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'late' } });
        fireEvent.click(addButton);

        expect(await screen.findByText(/Failed to create attendance entry/i)).toBeInTheDocument();
    });

    it('updates an attendance entry successfully', async () => {
        const mockEntries: AttendanceEntry[] = [
            { id: '1', studentName: 'Alice', status: 'present', recordedAt: '2024-01-01T08:00:00Z' },
        ];
        const updatedEntry: AttendanceEntry = { id: '1', studentName: 'Alice Smith', status: 'present', recordedAt: '2024-01-01T08:00:00Z', updatedAt: '2024-01-01T09:00:00Z' };
        (attendanceApi.attendanceApi.listEntries as Mock).mockResolvedValue(mockEntries);
        (attendanceApi.attendanceApi.updateEntry as Mock).mockResolvedValue(updatedEntry);

        render(<AttendancePage />);

        expect(await screen.findByText('Alice')).toBeInTheDocument();
        
        fireEvent.click(screen.getByText(/Edit/));
        fireEvent.change(screen.getByPlaceholderText('Student Name'), { target: { value: 'Alice Smith' } });
        fireEvent.click(screen.getByText(/Save/));
        expect(await screen.findByText('Alice Smith')).toBeInTheDocument();
    });

    it('deletes an attendance entry successfully', async () => {
        const mockEntries: AttendanceEntry[] = [
            { id: '1', studentName: 'Alice', status: 'present', recordedAt: '2024-01-01T08:00:00Z' },
        ];
        (attendanceApi.attendanceApi.listEntries as Mock).mockResolvedValue(mockEntries);
        (attendanceApi.attendanceApi.deleteEntry as Mock).mockResolvedValue(undefined);

        render(<AttendancePage />);

        expect(await screen.findByText('Alice')).toBeInTheDocument();
        fireEvent.click(await screen.findByText(/Delete/));
        await waitFor(() => expect(screen.queryByText('Alice')).not.toBeInTheDocument());
    });

});
