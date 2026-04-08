import type { AttendanceEntry, EntryStatus } from '../types';

type Props = { 
    entries: AttendanceEntry[]; 
    onDelete: (id: string) => void;
    onEdit: (entry: AttendanceEntry) => void;
    onCancel: () => void;
    editDraft: {
        id: string;
        studentName: string;
        status: EntryStatus;
        recordedAt: string;
    } | null;
    onEditStudentNameChange: (name: string) => void;
    onEditStatusChange: (status: EntryStatus) => void;
    onSaveEdit: () => void;
};

export default function AttendanceList({ 
    entries, 
    onDelete, 
    onEdit, 
    onCancel, 
    editDraft,
    onEditStudentNameChange,
    onEditStatusChange,
    onSaveEdit
}: Props) {

    return (
        <ul>
            { entries.map((e) => {
                const isEditing = editDraft?.id === e.id;
                if (isEditing) {
                    return (
                        <li key={e.id}>
                            <input 
                                value={editDraft?.studentName || ''} 
                                onChange={(evt) => onEditStudentNameChange(evt.target.value)} 
                            />
                            <select value={editDraft?.status || ''} onChange={(evt) => onEditStatusChange(evt.target.value as EntryStatus)}>
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="late">Late</option>
                                <option value="excused">Excused</option>
                            </select>
                            <button onClick={onCancel}>Cancel</button>
                            <button onClick={onSaveEdit}>Save</button>
                        </li>
                    );
                }
                return (
                <li key={e.id}>
                    <strong>{e.studentName}</strong> - {e.status}{" "}
                    <small>{new Date(e.updatedAt ? e.updatedAt : e.recordedAt).toLocaleTimeString()}</small>
                    <button onClick={() => onDelete(e.id)}>Delete</button>
                    <button onClick={() => onEdit(e)}>Edit</button>
                </li>
                )
            })}
        </ul>
    );
}