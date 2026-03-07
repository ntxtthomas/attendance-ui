import { useState, useEffect } from 'react';
import type { AttendanceEntry, EntryStatus, FilterStatus } from '../types'; 
import AttendanceForm from '../components/AttendanceForm';  
import AttendanceSummary from '../components/AttendanceSummary';
import { attendanceApi } from '../api/attendanceApi';

const nowIso = () => new Date().toISOString();
const id = () => crypto.randomUUID();

export default function AttendancePage() {
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await attendanceApi.listEntries();
      setEntries(data);
    } catch {
      setError('An unexpected error occurred');
    } finally { 
      setIsLoading(false);
      }
  };

  useEffect(() => { loadEntries(); }, []);

  const addEntry = (studentName: string, status: EntryStatus) => {
    setEntries((prev) => [
      { id: id(), studentName, status, recordedAt: nowIso() },
      ...prev, 
    ]);
  };

  const [status, setStatus] = useState<FilterStatus>('all');
  const filteredEntries = entries.filter (e => status === 'all' || e.status === status);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Attendance Page</h1>
        <p>Loading attendance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Attendance Page</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={loadEntries}>Retry</button>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Attendance Page</h1>
        <p>No attendance entries yet</p>
        <AttendanceForm onSubmit={addEntry} />
      </div>
    );
  }
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Attendance Page</h1>
      <AttendanceForm onSubmit={addEntry} />
      <AttendanceSummary entries={entries} />
      <br />
      <select value={status} style={{ margin: '20px 20px 20px 10px' }} onChange={(e) => setStatus(e.target.value as FilterStatus)}>
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