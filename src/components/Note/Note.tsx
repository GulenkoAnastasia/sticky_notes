import "./Note.css";
import { memo } from "react";
import type { Note as NoteType } from "../../types";
import { COLOR_MAP } from "../../constants";
import { useNoteInteractions } from "../../hooks/useNoteInteractions";
import RemoveIcon from "../../assets/icons/trash-full.svg?react";

interface NoteProps {
  note: NoteType;
  onUpdate: (id: string, changes: Partial<NoteType>) => void;
  onRemove: (id: string) => void;
  onBringToFront: (id: string) => void;
  onDragMove?: (x: number, y: number) => void;
  onDragEnd?: (id: string) => void;
}

export const Note = memo<NoteProps>(({
  note,
  onUpdate,
  onRemove,
  onBringToFront,
  onDragMove,
  onDragEnd,
}) => {
  const { onDragStart: handleDragStart, onResizeStart } = useNoteInteractions(
    note,
    onUpdate,
    onDragMove,
    onDragEnd,
  );

  return (
    <div
      className="note"
      onMouseDown={() => onBringToFront(note.id)}
      onDoubleClick={(e) => e.stopPropagation()}
      style={{
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height,
        zIndex: note.zIndex,
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
          <RemoveIcon width={20} height={20} color={COLOR_MAP[note.color].bg} />
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
});
