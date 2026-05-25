import { useRef } from "react";
import type React from "react";
import type { Note } from "../types";
import { NOTE_MIN } from "../constants";
import { attachMouseListeners } from "../utils/attachMouseListeners";

export const useNoteInteractions = (
  note: Note,
  onUpdate: (id: string, changes: Omit<Partial<Note>, "id">) => void,
  onDragMove?: (x: number, y: number) => void,
  onDragEnd?: (id: string, position: { x: number; y: number }) => void,
) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    offsetRef.current = { x: e.clientX - note.x, y: e.clientY - note.y };
    let position = { x: note.x, y: note.y };

    attachMouseListeners(
      (e) => {
        const x = e.clientX - offsetRef.current.x;
        const y = e.clientY - offsetRef.current.y;
        position = { x, y };

        if (elementRef.current) {
          elementRef.current.style.left = `${x}px`;
          elementRef.current.style.top = `${y}px`;
        }

        onDragMove?.(e.clientX, e.clientY);
      },
      () => onDragEnd?.(note.id, position),
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

  return { elementRef, onDragStart: onMouseDown, onResizeStart };
};
