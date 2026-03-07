import type { AttendanceEntry } from '../types'; 


export const attendanceApi = {
    listEntries(): Promise<AttendanceEntry[]> {
    return fetch('http://localhost:3001/attendance')
        .then(response => response.json());
    },
    isLoading(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, 2000));
    },
};