## Architecture

The application state is managed through a single custom hook, `useNotes`, which serves as the source of truth for all notes. It exposes `addNote`, `updateNote`, `removeNote`, and `bringToFront`. Persistence is handled by a debounced `useEffect` that writes to `localStorage` at most once per 300ms, avoiding redundant writes on every keystroke.

Drag and resize logic lives entirely in `Board` via `onPointerDown`, `onPointerMove`, and `onPointerUp` handlers. `onPointerDown` is passed as a prop to `Note`, which calls it with the note's ref and the action type (`drag` or `resize`). During interaction, position and size are updated directly via inline styles to avoid re-renders on every move — React state is only synced on `pointerup`. Drag is bounded within the board on all sides except the bottom, so notes can reach the `TrashZone`. Pointer capture is set on the note element during drag — this ensures `pointermove` and `pointerup` events are still received even if the pointer moves outside the board, preventing the drag from getting stuck.

For performance, `Note` is wrapped in `memo` and all callbacks passed to it are wrapped in `useCallback`. This ensures that when one note updates, the rest do not re-render, since their props references stay stable. `useContext` was considered for passing callbacks down to `Note`, but since context changes cause all consuming components to re-render regardless of `memo`, props were kept to preserve the memoization benefits.

`NoteColor` is defined as a union type rather than a plain `string`, so invalid colors are caught at compile time. CSS custom properties are used for all shared colors, making the palette easy to update from a single place.

Each component owns its CSS file, co-located in the same folder — this makes it immediately clear which styles belong to which component, simplifies deletion (removing a component means removing one folder), and avoids the risk of orphaned styles accumulating over time.
