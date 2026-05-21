import "./Board.css";
import { useCallback, useRef, useState, type FC, type MouseEvent } from "react";
import type { NoteColor } from "../../types";
import { useNotes } from "../../hooks/useNotes";
import { Note } from "../Note";
import { TrashZone } from "../TrashZone";
import { EmptyBoard } from "../EmptyBoard";

interface BoardProps {
  selectedColor: NoteColor;
}

export const Board: FC<BoardProps> = ({ selectedColor }) => {
  const { notes, addNote, updateNote, removeNote, bringToFront } = useNotes();
  const [isDragging, setIsDragging] = useState(false);
  const [isOverTrash, setIsOverTrash] = useState(false);
  const trashRef = useRef<HTMLDivElement>(null);

  const checkOverTrash = useCallback((x: number, y: number) => {
    setIsDragging(true);
    if (!trashRef.current) return;
    const rect = trashRef.current.getBoundingClientRect();
    setIsOverTrash(
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom,
    );
  }, []);

  const handleDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
    addNote(event.clientX, event.clientY, selectedColor);
  };

  const handleDragEnd = useCallback(
    (id: string) => {
      setIsDragging(false);
      setIsOverTrash((prev) => {
        if (prev) removeNote(id);
        return false;
      });
    },
    [removeNote],
  );

  return (
    <div className="board" onDoubleClick={handleDoubleClick}>
      {!notes.length && <EmptyBoard />}
      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          onUpdate={updateNote}
          onRemove={removeNote}
          onBringToFront={bringToFront}
          onDragMove={checkOverTrash}
          onDragEnd={handleDragEnd}
        />
      ))}
      {isDragging && <TrashZone ref={trashRef} isOver={isOverTrash} />}
    </div>
  );
};
