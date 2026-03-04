import { useState } from 'react';
import type { AttendanceStatus } from '../types';

type Props = {
    onSubmit: (studentName: string, status: AttendanceStatus) => void;
};

export default function AttendanceForm({ onSubmit }: Props) {
    const [studentName, setStudentName] = useState('');
    const [status, setStatus] = useState<AttendanceStatus>('present');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = studentName.trim();
        if (!trimmedName) return;
        onSubmit(studentName, status);
        setStudentName('');
        setStatus('present');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Student Name"
                required
            />
            <select value={status} style={{ margin: '0 40px 20px 10px' }} onChange={(e) => setStatus(e.target.value as AttendanceStatus)}>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
            </select>
            <button type="submit">Add Attendance</button>
        </form>
    );
}