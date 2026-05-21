import { useRef } from "react";
import type React from "react";
import type { Note } from "../types";
import { NOTE_MIN } from "../constants";
import { attachMouseListeners } from "../utils/attachMouseListeners";

export const useNoteInteractions = (
  note: Note,
  onUpdate: (id: string, changes: Partial<Note>) => void,
  onDragMove?: (x: number, y: number) => void,
  onDragEnd?: (id: string) => void,
) => {
  const offsetRef = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    offsetRef.current = { x: e.clientX - note.x, y: e.clientY - note.y };
    attachMouseListeners(
      (e) => {
        onUpdate(note.id, { x: e.clientX - offsetRef.current.x, y: e.clientY - offsetRef.current.y });
        onDragMove?.(e.clientX, e.clientY);
      },
      () => onDragEnd?.(note.id),
    );
  };

  const onResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = note.width;
    const startH = note.height;
    attachMouseListeners((e) =>
      onUpdate(note.id, {
        width: Math.max(NOTE_MIN.width, startW + e.clientX - startX),
        height: Math.max(NOTE_MIN.height, startH + e.clientY - startY),
      }),
    );
  };

  return { onDragStart: onMouseDown, onResizeStart };
};
