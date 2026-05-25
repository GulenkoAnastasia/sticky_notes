import type { NoteColor } from "../types";
import { COLORS } from "../constants";

export const isValidNote = (note: unknown) => {
  if (!note || typeof note !== "object") return false;
  const n = note as Record<string, unknown>;

  return (
    typeof n.id === "string" &&
    typeof n.text === "string" &&
    Number.isFinite(n.x) &&
    Number.isFinite(n.y) &&
    Number.isFinite(n.width) &&
    Number.isFinite(n.height) &&
    COLORS.includes(n.color as NoteColor)
  );
};
