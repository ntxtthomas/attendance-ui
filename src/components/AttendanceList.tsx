import type { AttendanceEntry } from '../types';

type Props = { entries: AttendanceEntry[];};

export default function AttendanceList({ entries }: Props) {
    return (
            <ul>
                { entries.map((e) => (
                <li key={e.id}>
                    <strong>{e.studentName}</strong> - {e.status}{" "}
                    <small>{new Date(e.recordedAt).toLocaleTimeString()}</small>
                </li>
                ))}
            </ul>
    );
}