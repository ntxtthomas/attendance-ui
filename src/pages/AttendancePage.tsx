import { useState } from 'react';

export default function AttendancePage() {
  const [presentCount, setPresentCount] = useState<number>(0);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Attendance Page</h1>
      <p>Present Today: {presentCount}</p>
      <button onClick={() => setPresentCount((c) => c + 1)}>
        Mark Present
      </button>
    </div>
  );
}