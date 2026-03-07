import type { AttendanceEntry } from '../types'; 

export const attendanceApi = { 
    async listEntries(): Promise<AttendanceEntry[]> {
        const response = await fetch('http://localhost:3001/attendance');
        if (!response.ok) {
            throw new Error(`Failed to fetch attendance entries: ${response.status}`);
        }
        return await response.json() as Promise<AttendanceEntry[]>;
    }
};