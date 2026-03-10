import type { AttendanceEntry } from '../types';

type Props = { 
    entries: AttendanceEntry[]; 
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    onCancel: () => void;
    editingId: string | null;
};

export default function AttendanceList({ entries, onDelete, onEdit, onCancel, editingId }: Props) {

    return (
        <ul>
            { entries.map((e) => {
                const isEditing = editingId === e.id;
                if (isEditing) {
                    return (
                        <li key={e.id}>
                            <em>Editing...</em>
                            <button onClick={onCancel}>Cancel</button>
                        </li>
                    );
                }
                return (
                <li key={e.id}>
                    <strong>{e.studentName}</strong> - {e.status}{" "}
                    <small>{new Date(e.recordedAt).toLocaleTimeString()}</small>
                    <button onClick={() => onDelete(e.id)}>Delete</button>
                    <button onClick={() => onEdit(e.id)}>Edit</button>
                </li>
                )
            })}
        </ul>
    );
}