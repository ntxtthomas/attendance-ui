import type { AttendanceEntry, EntryStatus } from '../types'; 

const BASE_URL = 'http://localhost:3001/attendance';

export const attendanceApi = { 
    async listEntries(): Promise<AttendanceEntry[]> {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch attendance entries: ${response.status}`);
        }
        return await response.json() as AttendanceEntry[];
    }, 
    async createEntry(studentName: string, status: EntryStatus, recordedAt: string): Promise<AttendanceEntry> {
        
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentName, status, recordedAt }),
        });
        if (!response.ok) {
            throw new Error(`Failed to create attendance entry: ${response.status}`);
        }
        return await response.json() as AttendanceEntry;
    }, 
    async deleteEntry(id: string): Promise<void> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete attendance entry: ${response.status}`);
        }
        return;
    },
    async updateEntry(id: string, updates: { studentName: string, status: EntryStatus, recordedAt: string }): Promise<AttendanceEntry> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });
        if (!response.ok) {
            throw new Error(`Failed to update attendance entry: ${response.status}`);
        }
        return await response.json() as AttendanceEntry;
    }
};
