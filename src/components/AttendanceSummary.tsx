import type { AttendanceEntry } from '../types';

type Props = {
    entries: AttendanceEntry[];
};

export default function AttendanceSummary({ entries }: Props) {
    const presentCount = entries.filter(e => e.status === 'present').length;
    const absentCount = entries.filter(e => e.status === 'absent').length;
    const lateCount = entries.filter(e => e.status === 'late').length;
    const excusedCount = entries.filter(e => e.status === 'excused').length;
    const allCount = presentCount + absentCount + lateCount + excusedCount;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
                <p>All: {allCount}</p>
                <p>Present: {presentCount}</p>
                <p>Absent: {absentCount}</p>
                <p>Late: {lateCount}</p>
                <p>Excused: {excusedCount}</p>
            </div>
        </div>
    );
}
