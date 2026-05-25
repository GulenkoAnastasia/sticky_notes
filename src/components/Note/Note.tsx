import "./Note.css";
import { memo } from "react";
import type { Note as NoteType } from "../../types";
import { COLOR_MAP } from "../../constants";
import { useNoteInteractions } from "../../hooks/useNoteInteractions";
import RemoveIcon from "../../assets/icons/trash-full.svg?react";

interface NoteProps {
  note: NoteType;
  index: number;
  onUpdate: (id: string, changes: Omit<Partial<NoteType>, "id">) => void;
  onRemove: (id: string) => void;
  onBringToFront?: (id: string) => void;
  onDragMove?: (x: number, y: number) => void;
  onDragEnd?: (id: string, pos: { x: number; y: number }) => void;
}

export const Note = memo<NoteProps>(
  ({
    note,
    index,
    onUpdate,
    onRemove,
    onBringToFront,
    onDragMove,
    onDragEnd,
  }) => {
    const {
      elementRef,
      onDragStart: handleDragStart,
      onResizeStart,
    } = useNoteInteractions(note, onUpdate, onDragMove, onDragEnd);

    return (
      <div
        ref={elementRef}
        className="note"
        onMouseDown={() => onBringToFront?.(note.id)}
        onDoubleClick={(e) => e.stopPropagation()}
        style={{
          left: note.x,
          top: note.y,
          width: note.width,
          height: note.height,
          zIndex: index + 1,
          background: COLOR_MAP[note.color].bg,
        }}
      >
        <div
          className="note__header"
          style={{ background: COLOR_MAP[note.color].border }}
          onMouseDown={handleDragStart}
        >
          <button
            className="note__delete"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onRemove(note.id)}
          >
            <RemoveIcon
              width={20}
              height={20}
              color={COLOR_MAP[note.color].bg}
            />
          </button>
        </div>
        <textarea
          className="note__text"
          value={note.text}
          onChange={(e) => onUpdate(note.id, { text: e.target.value })}
          placeholder="Type something..."
        />
        <div className="note__resize" onMouseDown={onResizeStart} />
      </div>
    );
  },
);
