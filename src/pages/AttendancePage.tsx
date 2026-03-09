import { useState, useEffect } from 'react';
import type { AttendanceEntry, EntryStatus, FilterStatus } from '../types'; 
import AttendanceForm from '../components/AttendanceForm';  
import AttendanceSummary from '../components/AttendanceSummary';
import { attendanceApi } from '../api/attendanceApi';

const nowIso = () => new Date().toISOString();

export default function AttendancePage() {
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const loadEntries = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await attendanceApi.listEntries();
      setEntries(data);
    } catch {
      setLoadError('Failed to load attendance entries');
    } finally { 
      setIsLoading(false);
      }
  };

  useEffect(() => { loadEntries(); }, []);

  const addEntry = async(studentName: string, status: EntryStatus) => {
    setCreateError(null);
    try {
      const created = await attendanceApi.createEntry(studentName, status, nowIso());
      setEntries((prev) => [created, ...prev]);
    } catch {
      setCreateError('Failed to create attendance entry');
    }
  };

  const [filter, setFilter] = useState<FilterStatus>('all');
  const filteredEntries = entries.filter (e => filter === 'all' || e.status === filter);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Attendance Page</h1>
        <p>Loading attendance...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Attendance Page</h1>
        <p style={{ color: 'red' }}>{loadError}</p>
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
        {createError && <p style={{ color: 'red' }}>{createError}</p>}
      </div>
    );
  }
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Attendance Page</h1>
      <AttendanceForm onSubmit={addEntry} />
      {createError && <p style={{ color: 'red' }}>{createError}</p>}
      <AttendanceSummary entries={entries} />
      <br />
      <select value={filter} style={{ margin: '20px 20px 20px 10px' }} onChange={(e) => setFilter(e.target.value as FilterStatus)}>
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