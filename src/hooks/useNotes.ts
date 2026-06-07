import { useCallback, useEffect, useMemo, useState } from "react";
import type { Note, NoteColor } from "../types";
import { NOTE_DEFAULTS } from "../constants";
import { debounce, isValidNote } from "../utils";

const STORAGE_KEY = "notes";

const load = (): Note[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidNote);
  } catch {
    return [];
  }
};

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>(load);

  const debouncedSave = useMemo(
    () =>
      debounce((n: Note[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(n));
      }, 300),
    [],
  );

  useEffect(() => {
    debouncedSave(notes);
  }, [notes, debouncedSave]);

  const addNote = useCallback((x: number, y: number, color: NoteColor) => {
    setNotes((prev) => {
      const note: Note = {
        id: crypto.randomUUID(),
        x,
        y,
        width: NOTE_DEFAULTS.width,
        height: NOTE_DEFAULTS.height,
        text: "",
        color,
      };

      return [...prev, note];
    });
  }, []);

  const updateNote = useCallback(
    (id: string, changes: Omit<Partial<Note>, "id">) => {
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? { ...note, ...changes } : note)),
      );
    },
    [],
  );

  const bringToFront = useCallback((id: string) => {
    setNotes((prev) => {
      if (prev.at(-1)?.id === id) return prev;

      const note = prev.find((note) => note.id === id);
      if (!note) return prev;

      return [...prev.filter((note) => note.id !== id), note];
    });
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }, []);

  return { notes, addNote, updateNote, bringToFront, removeNote };
};
