import type { AttendanceEntry, EntryStatus } from '../types'; 

const BASE_URL = 'http://localhost:3001/api/v1/attendance_entries';

const TOKEN_KEY = 'token';

const getToken = () => localStorage.getItem(TOKEN_KEY);

export const authToken = {
    get: () => getToken(),
    set: (value: string) => localStorage.setItem(TOKEN_KEY, value),
    clear: () => localStorage.removeItem(TOKEN_KEY),
};

const buildHeaders = (includeJson = false): Record<string, string> => {
    const headers: Record<string, string> = includeJson ? { 'Content-Type': 'application/json' } : {};
    const token = getToken();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return headers;
};

type AttendanceEntryPayload = {
    studentName: string;
    status: EntryStatus;
    recordedAt: string;
    updatedAt?: string;
};

type RailsAttendanceEntry = {
    id: string | number;
    student_name?: string;
    studentName?: string;
    status: EntryStatus;
    recorded_at?: string;
    recordedAt?: string;
    updated_at?: string;
    updatedAt?: string;
};

const toRailsPayload = (payload: AttendanceEntryPayload) => ({
    student_name: payload.studentName,
    status: payload.status,
    recorded_at: payload.recordedAt,
    ...(payload.updatedAt ? { updated_at: payload.updatedAt } : {}),
});

const fromApiEntry = (entry: RailsAttendanceEntry): AttendanceEntry => ({
    id: String(entry.id),
    studentName: entry.studentName ?? entry.student_name ?? '',
    status: entry.status,
    recordedAt: entry.recordedAt ?? entry.recorded_at ?? '',
    ...(entry.updatedAt || entry.updated_at ? { updatedAt: entry.updatedAt ?? entry.updated_at } : {}),
});

const parseListResponse = (payload: unknown): AttendanceEntry[] => {
    if (Array.isArray(payload)) {
        return payload.map(item => fromApiEntry(item as RailsAttendanceEntry));
    }
    if (payload && typeof payload === 'object') {
        const objectPayload = payload as Record<string, unknown>;
        if (Array.isArray(objectPayload.entries)) {
            return objectPayload.entries.map(item => fromApiEntry(item as RailsAttendanceEntry));
        }
        if (Array.isArray(objectPayload.attendance_entries)) {
            return objectPayload.attendance_entries.map(item => fromApiEntry(item as RailsAttendanceEntry));
        }
        if (Array.isArray(objectPayload.data)) {
            return objectPayload.data.map(item => fromApiEntry(item as RailsAttendanceEntry));
        }
    }
    return [];
};

const parseEntryResponse = (payload: unknown): AttendanceEntry => {
    if (payload && typeof payload === 'object') {
        const objectPayload = payload as Record<string, unknown>;
        if (objectPayload.attendance_entry && typeof objectPayload.attendance_entry === 'object') {
            return fromApiEntry(objectPayload.attendance_entry as RailsAttendanceEntry);
        }
        return fromApiEntry(objectPayload as RailsAttendanceEntry);
    }
    throw new Error('API returned an invalid attendance entry payload.');
};

const getResponseErrorDetails = async (response: Response): Promise<string | null> => {
    try {
        const body = await response.clone().json() as unknown;
        if (body && typeof body === 'object') {
            const objectBody = body as Record<string, unknown>;
            if (Array.isArray(objectBody.errors)) {
                return objectBody.errors.filter(Boolean).join(', ');
            }
            if (typeof objectBody.error === 'string') {
                return objectBody.error;
            }
            if (typeof objectBody.message === 'string') {
                return objectBody.message;
            }
        }
    } catch {
    }
    return null;
};

const buildApiError = async (action: string, response: Response): Promise<Error> => {
    const { status } = response;
    if (status === 401) {
        const token = getToken();
        if (!token) {
            return new Error(`Unauthorized (401) during ${action}. No auth token found in localStorage key "${TOKEN_KEY}".`);
        }
        return new Error(`Unauthorized (401) during ${action}. Token is present but was rejected by the API.`);
    }
    if (status === 422) {
        const details = await getResponseErrorDetails(response);
        if (details) {
            return new Error(`Validation failed (422) during ${action}: ${details}`);
        }
        return new Error(`Validation failed (422) during ${action}. Check Rails strong params and validations.`);
    }
    return new Error(`Failed to ${action}: ${status}`);
};

export const attendanceApi = { 
    async listEntries(): Promise<AttendanceEntry[]> {
        const response = await fetch(BASE_URL, {
            headers: buildHeaders(),
        });
        if (!response.ok) {
            throw await buildApiError('fetch attendance entries', response);
        }
        const payload = await response.json() as unknown;
        return parseListResponse(payload);
    }, 
    async createEntry(studentName: string, status: EntryStatus, recordedAt: string): Promise<AttendanceEntry> {
        const railsPayload = toRailsPayload({ studentName, status, recordedAt });
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: buildHeaders(true),
            body: JSON.stringify({
                attendance_entry: railsPayload,
                ...railsPayload,
            }),
        });
        if (!response.ok) {
            throw await buildApiError('create attendance entry', response);
        }
        const payload = await response.json() as unknown;
        return parseEntryResponse(payload);
    }, 
    async deleteEntry(id: string): Promise<void> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: buildHeaders(),
        });
        if (!response.ok) {
            throw await buildApiError('delete attendance entry', response);
        }
        return;
    },
    async updateEntry(id: string, updates: { studentName: string, status: EntryStatus, recordedAt: string, updatedAt: string }): Promise<AttendanceEntry> {
        const railsPayload = toRailsPayload(updates);
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: buildHeaders(true),
            body: JSON.stringify({
                attendance_entry: railsPayload,
                ...railsPayload,
            }),
        });
        if (!response.ok) {
            throw await buildApiError('update attendance entry', response);
        }
        const payload = await response.json() as unknown;
        return parseEntryResponse(payload);
    }
};
