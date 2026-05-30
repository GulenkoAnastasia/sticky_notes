import "./Note.css";
import { memo } from "react";
import type { Note as NoteType } from "../../types";
import { COLOR_MAP } from "../../constants";
import RemoveIcon from "../../assets/icons/trash-full.svg?react";

interface NoteProps {
  note: NoteType;
  index: number;
  onUpdate: (id: string, changes: Omit<Partial<NoteType>, "id">) => void;
  onRemove: (id: string) => void;
  onBringToFront?: (id: string) => void;
}

export const Note = memo<NoteProps>(
  ({ note, index, onUpdate, onRemove, onBringToFront }) => {
    return (
      <div
        data-id={note.id}
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
          onDragStart={(e) => e.preventDefault()}
        />
        <div className="note__resize" />
      </div>
    );
  },
);
