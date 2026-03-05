import { useState, useEffect } from 'react';
import type { AttendanceEntry, EntryStatus, FilterStatus } from '../types'; 
import AttendanceForm from '../components/AttendanceForm';  
import AttendanceSummary from '../components/AttendanceSummary';
import { attendanceApi } from '../api/attendanceApi';

const nowIso = () => new Date().toISOString();
const id = () => crypto.randomUUID();

export default function AttendancePage() {
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);
  useEffect(() => {
    attendanceApi.listEntries().then(setEntries);
  }, []);

  const addEntry = (studentName: string, status: EntryStatus) => {
    setEntries((prev) => [
      { id: id(), studentName, status, recordedAt: nowIso() },
      ...prev, 
    ]);
  };

  const [status, setStatus] = useState<FilterStatus>('all');
  const filteredEntries = entries.filter (e => status === 'all' || e.status === status);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Attendance Page</h1>
      <AttendanceForm onSubmit={addEntry} />
      <AttendanceSummary entries={entries} />
      <button onClick={() => addEntry('New Student', 'present')}>
        Quick Add Present
      </button>
      <br />
      <select value={status} style={{ margin: '40px 40px 20px 10px' }} onChange={(e) => setStatus(e.target.value as EntryStatus)}>
          <option value="all">All</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
          <option value="excused">Excused</option>
      </select>

      <ul>
        { filteredEntries.map((e) => (
          <li key={e.id}>
            <strong>{e.studentName}</strong> - {e.status}{" "}
            <small>{new Date(e.recordedAt).toLocaleTimeString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}