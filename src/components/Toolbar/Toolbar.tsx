import "./Toolbar.css";
import type { FC } from "react";
import type { NoteColor } from "../../types";
import { COLOR_MAP, COLORS } from "../../constants";
import CheckIcon from "../../assets/icons/check.svg?react";

interface ToolbarProps {
  selectedColor: NoteColor;
  onColorChange: (color: NoteColor) => void;
}

export const Toolbar: FC<ToolbarProps> = ({ selectedColor, onColorChange }) => {
  return (
    <header className="toolbar">
      <h1 className="toolbar__title">Sticky Notes</h1>
      <div className="toolbar__colors">
        {COLORS.map((color) => (
          <button
            key={color}
            className="toolbar__color-btn"
            style={{
              background: COLOR_MAP[color].bg,
              border:
                selectedColor === color
                  ? `3px solid ${COLOR_MAP[color].border}`
                  : `1.5px solid ${COLOR_MAP[color].border}`,
              opacity: selectedColor === color ? 1 : 0.45,
            }}
            onClick={() => onColorChange(color)}
          >
            {selectedColor === color && (
              <CheckIcon
                width={18}
                height={18}
                color={COLOR_MAP[color].border}
              />
            )}
          </button>
        ))}
      </div>
    </header>
  );
};
