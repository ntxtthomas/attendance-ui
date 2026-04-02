import { useCallback, useEffect, useState } from "react";
import { attendanceApi } from "../api/attendanceApi";
import type { AttendanceEntry, EntryStatus } from "../types";

type UpdateInput = {
    studentName: string;
    status: EntryStatus;
    recordedAt: string;
    updatedAt: string;
};

const toErrorMessage = (err: unknown): string =>
    err instanceof Error ? err.message : String(err)

export function useAttendanceEntries() {
    const [entries, setEntries] = useState<AttendanceEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reload = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await attendanceApi.listEntries();
            setEntries(data);
        } catch (err) {
            setError(toErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void reload();
    }, [reload]);

    const createEntry = useCallback(
        async (
            studentName: string, 
            status: EntryStatus, 
            recordedAt: string
        ) => {
            setIsSaving(true);
            setError(null);
            try {
                const created = await attendanceApi.createEntry(studentName, status, recordedAt);
                setEntries((prev) => [created, ...prev]);
                return created;
            } catch (err) {
                const message = toErrorMessage(err);
                setError(message);
                throw err;
            } finally {
                setIsSaving(false);
            }
        },
        []
    );

    const updateEntry = useCallback(
        async (id: string, input: UpdateInput) => {
            setIsSaving(true);
            setError(null);
            try {
                const updated = await attendanceApi.updateEntry(id, input);
                setEntries((prev) => prev.map(e => e.id === id ? updated : e));
            } catch (err) {
                const message = toErrorMessage(err);
                setError(message);
                throw err;
            } finally {
                setIsSaving(false);
            }
        },
        []
    );

    const deleteEntry = useCallback(
        async (id: string) => {
            setIsSaving(true);
            setError(null);
            try {
                await attendanceApi.deleteEntry(id);
                setEntries((prev) => prev.filter(e => e.id !== id));
            } catch (err) {
                const message = toErrorMessage(err);
                setError(message);
                throw err;
            } finally {
                setIsSaving(false);
            }
        },
        []
    );

    return {
        entries,
        isLoading,
        isSaving,
        error,
        reload,
        createEntry,
        updateEntry,
        deleteEntry,
    };
};