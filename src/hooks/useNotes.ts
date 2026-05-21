import { useCallback, useEffect, useState } from "react";
import type { Note, NoteColor } from "../types";
import { NOTE_DEFAULTS } from "../constants";

const STORAGE_KEY = "notes";

const load = (): Note[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

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
        zIndex: prev.length ? Math.max(...prev.map((n) => n.zIndex)) + 1 : 1,
      };

      return [...prev, note];
    });
  }, []);

  const updateNote = useCallback((id: string, changes: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...changes } : note)),
    );
  }, []);

  const bringToFront = useCallback((id: string) => {
    setNotes((prev) => {
      const maxZ = Math.max(...prev.map((note) => note.zIndex));
      return prev.map((note) =>
        note.id === id ? { ...note, zIndex: maxZ + 1 } : note,
      );
    });
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }, []);

  return { notes, addNote, updateNote, bringToFront, removeNote };
};
