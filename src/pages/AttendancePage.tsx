import { useMemo, useState } from 'react';
import type { AttendanceEntry, AttendanceStatus } from '../types'; 
import AttendanceForm from '../components/AttendanceForm';  

const nowIso = () => new Date().toISOString();
const id = () => crypto.randomUUID();

export default function AttendancePage() {
  const [entries, setEntries] = useState<AttendanceEntry[]>([
    {id: id(), studentName: 'John Doe', status: 'present', recordedAt: nowIso()},
    {id: id(), studentName: 'Jane Doe', status: 'absent', recordedAt: nowIso()},
  ]);

  const presentCount = useMemo(() => 
    entries.filter(entry => entry.status === 'present').length, 
    [entries]
  );

  const addEntry = (studentName: string, status: AttendanceStatus) => {
    setEntries((prev) => [
      { id: id(), studentName, status, recordedAt: nowIso() },
      ...prev, 
    ]);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Attendance Page</h1>
      <p>Present Today: {presentCount}</p>
      <AttendanceForm onSubmit={addEntry} />
      <button onClick={() => addEntry('New Student', 'present')}>
        Quick Add Present
      </button>

      <ul>
        { entries.map((e) => (
          <li key={e.id}>
            <strong>{e.studentName}</strong> - {e.status}{" "}
            <small>{new Date(e.recordedAt).toLocaleTimeString()})</small>
          </li>
        ))}
      </ul>
    </div>
  );
}