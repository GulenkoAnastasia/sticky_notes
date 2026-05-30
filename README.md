## Architecture

The application state is managed through a single custom hook, `useNotes`, which serves as the source of truth for all notes. It exposes `addNote`, `updateNote`, `removeNote`, and `bringToFront`. Persistence is handled by a debounced `useEffect` that writes to `localStorage` at most once per 300ms, avoiding redundant writes on every keystroke.

Drag and resize logic lives entirely in `Board` via `onMouseDown`, `onMouseMove`, and `onMouseUp` handlers on the board container. The target note is identified using `e.target.closest()`. During interaction, the note's position and size are updated directly via inline styles to avoid re-renders on every mouse move — React state is only synced on `mouseup`. Drag is bounded within the board on all sides except the bottom, so notes can reach the `TrashZone`. Pointer events are disabled on the dragged note so mouse events always reach the board.

For performance, `Note` is wrapped in `memo` and all callbacks passed to it are wrapped in `useCallback` — in `useNotes`. This ensures that when one note updates, the rest do not re-render, since their props references stay stable.

`NoteColor` is defined as a union type rather than a plain `string`, so invalid colors are caught at compile time. CSS custom properties are used for all shared colors, making the palette easy to update from a single place.

Each component owns its CSS file, co-located in the same folder — this makes it immediately clear which styles belong to which component, simplifies deletion (removing a component means removing one folder), and avoids the risk of orphaned styles accumulating over time.
