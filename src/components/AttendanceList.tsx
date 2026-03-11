import type { AttendanceEntry, EntryStatus } from '../types';

type Props = { 
    entries: AttendanceEntry[]; 
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    onCancel: () => void;
    editingId: string | null;
    editStudentName: string | null;
    editStatus: EntryStatus | null;
    onEditStudentNameChange: (name: string) => void;
    onEditStatusChange: (status: EntryStatus) => void;
};

export default function AttendanceList({ 
    entries, 
    onDelete, 
    onEdit, 
    onCancel, 
    editingId, 
    editStudentName, 
    editStatus,
    onEditStudentNameChange,
    onEditStatusChange
}: Props) {

    return (
        <ul>
            { entries.map((e) => {
                const isEditing = editingId === e.id;
                if (isEditing) {
                    return (
                        <li key={e.id}>
                            <input 
                                value={editStudentName || ''} 
                                onChange={(e) => onEditStudentNameChange(e.target.value)} 
                            />
                            <select value={editStatus || ''} onChange={(e) => onEditStatusChange(e.target.value as EntryStatus)}>
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="late">Late</option>
                                <option value="excused">Excused</option>
                            </select>
                            <button onClick={onCancel}>Cancel</button>
                        </li>
                    );
                }
                return (
                <li key={e.id}>
                    <strong>{e.studentName}</strong> - {e.status}{" "}
                    <small>{new Date(e.updatedAt ? e.updatedAt : e.recordedAt).toLocaleTimeString()}</small>
                    <button onClick={() => onDelete(e.id)}>Delete</button>
                    <button onClick={() => onEdit(e.id)}>Edit</button>
                </li>
                )
            })}
        </ul>
    );
}