import { useState } from 'react';
import type { SubmitEvent, ChangeEvent } from 'react';
import type { EntryStatus } from '../types';

type Props = {
    onSubmit: (studentName: string, status: EntryStatus) => void;
};

export default function AttendanceForm({ onSubmit }: Props) {
    const [studentName, setStudentName] = useState('');
    const [status, setStatus] = useState<EntryStatus>('present');
    const [error, setError] = useState('');

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const trimmedName = studentName.trim();
        if (!trimmedName) {
            setError('Student name is required');
            return;
        }

        setError('');
        onSubmit(trimmedName, status);
        setStudentName('');
        setStatus('present');
    };

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setStudentName(e.target.value);
        if (error) setError('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={studentName}
                onChange={handleNameChange}
                placeholder="Student Name"
                required
            />
            {error && <span style={{ color: 'red', marginLeft: '10px' }}>{error}</span>}
            
            <select value={status} style={{ margin: '0 40px 20px 10px' }} onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                setStatus(e.target.value as EntryStatus)}>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
            </select>
            <button type="submit">Add Attendance</button>
        </form>
    );
}