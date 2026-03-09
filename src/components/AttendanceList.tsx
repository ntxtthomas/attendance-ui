import type { AttendanceEntry } from '../types';

type Props = { 
    entries: AttendanceEntry[]; 
    onDelete: (id: string) => void;
};

export default function AttendanceList({ entries, onDelete }: Props) {

    return (
        <ul>
            { entries.map((e) => (
            <li key={e.id}>
                <strong>{e.studentName}</strong> - {e.status}{" "}
                <small>{new Date(e.recordedAt).toLocaleTimeString()}</small>
                <button onClick={() => onDelete(e.id)}>Delete</button>
            </li>
            ))}
        </ul>
    );
}