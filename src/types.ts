export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceEntry {
  id: string;
  studentName: string;
  status: AttendanceStatus;
  recordedAt: string;
}
