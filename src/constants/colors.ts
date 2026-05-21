import type { NoteColor } from "../types";

export const COLORS: NoteColor[] = [
  "yellow",
  "pink",
  "blue",
  "green",
  "purple",
  "orange",
];

export const COLOR_MAP: Record<NoteColor, { bg: string; border: string }> = {
  yellow: { bg: "#f9e04b", border: "#a38900" },
  pink: { bg: "#f9a8d4", border: "#a8346e" },
  blue: { bg: "#93c5fd", border: "#2563c4" },
  green: { bg: "#86efac", border: "#1a8f48" },
  purple: { bg: "#d8b4fe", border: "#7c22d4" },
  orange: { bg: "#fdba74", border: "#c45010" },
};
