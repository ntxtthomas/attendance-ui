export type EntryStatus = 'present' | 'absent' | 'late' | 'excused';
export type FilterStatus = 'all' | EntryStatus;

export interface AttendanceEntry {
  id: string;
  studentName: string;
  status: EntryStatus;
  recordedAt: string;
}
