import "./Board.css";
import {
  useRef,
  useState,
  type FC,
  type MouseEvent,
  type RefObject,
  type PointerEvent,
  useCallback,
} from "react";
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
    onMove: (e: PointerEvent<HTMLDivElement>) => void;
    action: "drag" | "resize";
  } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const checkOverTrash = useCallback((x: number, y: number) => {
    if (!trashRef.current) return;
    const rect = trashRef.current.getBoundingClientRect();
    const over =
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    isOverTrashRef.current = over;
    trashRef.current.classList.toggle("over", over);
  }, []);

  const handleDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    addNote(event.clientX - rect.left, event.clientY - rect.top, selectedColor);
  };

  const onPointerDown = useCallback(
    (
      e: PointerEvent<HTMLDivElement>,
      noteRef: RefObject<HTMLDivElement | null>,
      action: "drag" | "resize",
    ) => {
      const noteEl = noteRef.current;
      const board = boardRef.current;
      if (!noteEl || !board) return;

      const noteRect = noteEl.getBoundingClientRect();
      const boardRect = board.getBoundingClientRect();

      const grabX = e.clientX - noteRect.left;
      const grabY = e.clientY - noteRect.top;

      activeDragRef.current = {
        el: noteEl,
        action,
        onMove:
          action === "drag"
            ? (ev) => {
                const x = Math.max(
                  0,
                  Math.min(
                    ev.clientX - grabX - boardRect.left,
                    board.offsetWidth - noteEl.offsetWidth,
                  ),
                );
                const y = Math.max(0, ev.clientY - grabY - boardRect.top);
                noteEl.style.left = `${x}px`;
                noteEl.style.top = `${y}px`;
                checkOverTrash(ev.clientX, ev.clientY);
              }
            : (ev) => {
                const width = Math.max(
                  NOTE_MIN.width,
                  Math.min(ev.clientX - noteRect.left, board.offsetWidth),
                );
                const height = Math.max(
                  NOTE_MIN.height,
                  Math.min(ev.clientY - noteRect.top, board.offsetHeight),
                );
                noteEl.style.width = `${width}px`;
                noteEl.style.height = `${height}px`;
              },
      };
    },
    [checkOverTrash],
  );

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!activeDragRef.current) return;

    if (!activeDragRef.current.el?.hasPointerCapture(e.pointerId)) {
      activeDragRef.current.el?.setPointerCapture(e.pointerId);
      if (activeDragRef.current.action === "drag") setIsDragging(true);
    }

    activeDragRef.current.onMove(e);
  };

  const onPointerUp = () => {
    if (!activeDragRef.current) return;
    const { el } = activeDragRef.current;

    if (el.dataset.id) {
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
    }

    setIsDragging(false);
    activeDragRef.current = null;
  };

  return (
    <div
      ref={boardRef}
      className="board"
      onDoubleClick={handleDoubleClick}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {!notes.length && <EmptyBoard />}
      {notes.map((note, index) => (
        <Note
          key={note.id}
          onPointerDown={onPointerDown}
          note={note}
          index={index}
          onUpdate={updateNote}
          onRemove={removeNote}
          onBringToFront={bringToFront}
        />
      ))}
      {isDragging && <TrashZone ref={trashRef} />}
    </div>
  );
};
