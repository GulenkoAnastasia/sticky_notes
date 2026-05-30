import "./Board.css";
import { useRef, useState, type FC, type MouseEvent } from "react";
import type { NoteColor } from "../../types";
import { useNotes } from "../../hooks/useNotes";
import { Note } from "../Note";
import { TrashZone } from "../TrashZone";
import { EmptyBoard } from "../EmptyBoard";
import { NOTE_MIN } from "../../constants";

interface BoardProps {
  selectedColor: NoteColor;
}

export const Board: FC<BoardProps> = ({ selectedColor }) => {
  const { notes, addNote, updateNote, removeNote, bringToFront } = useNotes();
  const [isDragging, setIsDragging] = useState(false);
  const isOverTrashRef = useRef(false);
  const trashRef = useRef<HTMLDivElement>(null);
  const activeDragRef = useRef<{
    el: HTMLElement;
    onMove: (e: MouseEvent<HTMLDivElement>) => void;
  } | null>(null);

  const checkOverTrash = (x: number, y: number) => {
    setIsDragging(true);
    if (!trashRef.current) return;
    const rect = trashRef.current.getBoundingClientRect();
    const over =
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    isOverTrashRef.current = over;
    trashRef.current.classList.toggle("over", over);
  };

  const handleDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    addNote(event.clientX - rect.left, event.clientY - rect.top, selectedColor);
  };

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const noteEl = target.closest(".note") as HTMLElement | null;
    if (!noteEl?.dataset.id) return;

    const isDrag = !!target.closest(".note__header");
    const isResize = !!target.closest(".note__resize");
    if (!isDrag && !isResize) return;

    const board = e.currentTarget as HTMLElement;

    activeDragRef.current = {
      el: noteEl,
      onMove: isDrag
        ? (e) => {
            const x = Math.max(
              0,
              Math.min(
                parseFloat(noteEl.style.left) + e.movementX,
                board.offsetWidth - noteEl.offsetWidth,
              ),
            );
            const y = Math.max(0, parseFloat(noteEl.style.top) + e.movementY);
            noteEl.style.left = `${x}px`;
            noteEl.style.top = `${y}px`;
            checkOverTrash(e.clientX, e.clientY);
          }
        : (e) => {
            const width = Math.max(
              NOTE_MIN.width,
              Math.min(
                parseFloat(noteEl.style.width) + e.movementX,
                board.offsetWidth,
              ),
            );
            const height = Math.max(
              NOTE_MIN.height,
              Math.min(
                parseFloat(noteEl.style.height) + e.movementY,
                board.offsetHeight,
              ),
            );
            noteEl.style.width = `${width}px`;
            noteEl.style.height = `${height}px`;
          },
    };

    noteEl.style.pointerEvents = "none";
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) =>
    activeDragRef.current?.onMove(e);

  const onMouseUp = () => {
    if (!activeDragRef.current) return;
    const { el } = activeDragRef.current;

    if (isOverTrashRef.current) {
      removeNote(el.dataset.id);
      isOverTrashRef.current = false;
    } else {
      updateNote(el.dataset.id, {
        x: parseFloat(el.style.left),
        y: parseFloat(el.style.top),
        width: parseFloat(el.style.width),
        height: parseFloat(el.style.height),
      });
    }

    setIsDragging(false);
    activeDragRef.current = null;
    el.style.pointerEvents = "";
  };

  return (
    <div
      className="board"
      onDoubleClick={handleDoubleClick}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {!notes.length && <EmptyBoard />}
      {notes.map((note, index) => (
        <Note
          key={note.id}
          note={note}
          index={index}
          onUpdate={updateNote}
          onRemove={removeNote}
          onBringToFront={index !== notes.length - 1 ? bringToFront : undefined}
        />
      ))}
      {isDragging && <TrashZone ref={trashRef} />}
    </div>
  );
};
