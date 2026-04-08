import { useState } from 'react';
import type { AttendanceEntry, EntryStatus, FilterStatus } from '../types'; 
import AttendanceForm from '../components/AttendanceForm';  
import AttendanceSummary from '../components/AttendanceSummary';
import AttendanceList from '../components/AttendanceList';
import { useAttendanceEntries } from '../hooks/useAttendanceEntries';

const nowIso = () => new Date().toISOString();

type Props = {
    onSignOut: () => void;
};

type EditDraft = {
    id: string;
    studentName: string;
    status: EntryStatus;
    recordedAt: string;
};

export default function AttendancePage({ onSignOut }: Props ) {
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const { entries, isLoading, error: loadError, reload, createEntry, updateEntry, deleteEntry } = useAttendanceEntries();
  const [createError, setCreateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const addEntry = async(studentName: string, status: EntryStatus) => {
    setCreateError(null);
    try {
        await createEntry(studentName, status, nowIso());
    } catch (error) {
      const details = error instanceof Error ? error.message : null;
      setCreateError(details ? `Failed to create attendance entry: ${details}` : 'Failed to create attendance entry');
    }
  };

  const handleDelete  = async(id: string) => {
    setDeleteError(null);
    try {
        await deleteEntry(id);
    } catch (error) {
      const details = error instanceof Error ? error.message : null;
      setDeleteError(details ? `Failed to delete attendance entry: ${details}` : 'Failed to delete attendance entry');
    }
  };

  const handleStartEdit = (entry: AttendanceEntry) => {
    setUpdateError(null);
    setEditDraft({
      id: entry.id,
      studentName: entry.studentName,
      status: entry.status,
      recordedAt: entry.recordedAt,
    });
  };

  const handleCancelEdit = () => {
    setEditDraft(null);
    setUpdateError(null);
  }

  const handleSaveEdit = async () => {
    setUpdateError(null);
    if (!editDraft || !editDraft.studentName || !editDraft.status || !editDraft.recordedAt) {
      setUpdateError('All fields are required');
      return;
    } 
    if (isNaN(Date.parse(editDraft.recordedAt))) {
      setUpdateError('Invalid date format');
      return;
    }
    
    try {
      await updateEntry(editDraft.id, {
        studentName: editDraft.studentName,
        status: editDraft.status,
        recordedAt: editDraft.recordedAt,
        updatedAt: nowIso(),
      });
      
      setEditDraft(null);
    } catch (error) {
      const details = error instanceof Error ? error.message : null;
      setUpdateError(details ? `Failed to update attendance entry: ${details}` : 'Failed to update attendance entry');
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
        <p style={{ color: 'red' }}>Failed to load attendance entries: {loadError}</p>
        <button onClick={reload}>Retry</button>
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
        <button onClick={onSignOut}>Sign Out</button>
      </div>
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
        editDraft={editDraft}
        onEditStudentNameChange={(value) => setEditDraft((prev) => prev ? { ...prev, studentName: value } : prev)}
        onEditStatusChange={(value) => setEditDraft((prev) => prev ? { ...prev, status: value } : prev)}
        onSaveEdit={handleSaveEdit}
       />
      )}
    </div>
  );
}