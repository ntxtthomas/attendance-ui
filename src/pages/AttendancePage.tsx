import { useState, useEffect } from 'react';
import type { AttendanceEntry, EntryStatus, FilterStatus } from '../types'; 
import AttendanceForm from '../components/AttendanceForm';  
import AttendanceSummary from '../components/AttendanceSummary';
import AttendanceList from '../components/AttendanceList';
import { attendanceApi } from '../api/attendanceApi';

const nowIso = () => new Date().toISOString();

export default function AttendancePage() {
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStudentName, setEditStudentName] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<EntryStatus | null>(null);
  const [editRecordedAt, setEditRecordedAt] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

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

  const handleDelete  = async(id: string) => {
    setDeleteError(null);
    try {
      await attendanceApi.deleteEntry(id);
      setEntries((prev) => prev.filter(e => e.id !== id));
    } catch {
      setDeleteError('Failed to delete attendance entry');
    }
  };

  const handleStartEdit = (id: string) => {
    setUpdateError(null);
    setEditingId(id);
    const entry = entries.find(e => e.id === id);
    if (entry) {
      setEditStudentName(entry.studentName);
      setEditStatus(entry.status);
      setEditRecordedAt(entry.recordedAt);
      setUpdateError(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditStudentName(null);
    setEditStatus(null);
    setEditRecordedAt(null);
    setUpdateError(null);
  }

  const handleSaveEdit = async () => {
    setUpdateError(null);
    if (!editingId || !editStudentName || !editStatus || !editRecordedAt) {
      setUpdateError('All fields are required');
      return;
    } else if (isNaN(Date.parse(editRecordedAt))) {
      setUpdateError('Invalid date format');
      return;
    }
    try {
      const updated = await attendanceApi.updateEntry(editingId, {
        studentName: editStudentName,
        status: editStatus,
        recordedAt: editRecordedAt,
        updatedAt: nowIso(),
      });
      setEntries((prev) => prev.map(e => e.id === editingId ? updated : e));
      setEditingId(null);
      setEditStudentName(null);
      setEditStatus(null);
      setEditRecordedAt(null);
    } catch {
      setUpdateError('Failed to update attendance entry');
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
      <h2>Attendance Summary</h2>
      <AttendanceSummary entries={entries} />
      <br />
      <select value={filter} style={{ margin: '20px 20px 20px 10px' }} onChange={(e) => setFilter(e.target.value as FilterStatus)}>
          <option value="all">All</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
          <option value="excused">Excused</option>
      </select>
      <h2>Attendance List</h2>
      {deleteError && <p style={{ color: 'red' }}>{deleteError}</p>}
      {updateError && <p style={{ color: 'red' }}>{updateError}</p>}
      {filteredEntries.length === 0 ? (
      <p>No entries match this filter.</p>
      ) : (
      <AttendanceList 
        entries={filteredEntries} 
        onDelete={handleDelete} 
        onEdit={handleStartEdit}
        onCancel={handleCancelEdit} 
        editingId={editingId}
        editStudentName={editStudentName}
        editStatus={editStatus}
        onEditStudentNameChange={setEditStudentName}
        onEditStatusChange={setEditStatus}
        onSaveEdit={handleSaveEdit}
       />
      )}
    </div>
  );
}