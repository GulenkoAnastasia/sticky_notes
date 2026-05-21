## Architecture

The application state is managed through a single custom hook, `useNotes`, which serves as the source of truth for all notes. It exposes `addNote`, `updateNote`, `removeNote`, and `bringToFront`. Persistence is handled by a `useEffect` that watches the notes array and writes to `localStorage` on every change, keeping mutation logic pure and separate from storage concerns. React Context was considered but rejected — the component tree is shallow (props only pass one level down from `Board` to `Note`), and Context would cause all `Note` components to re-render on any state change, undermining the `memo` optimisation.

Drag and resize interactions are handled without any third-party library. Mouse listeners are attached to `document` rather than the element itself — this ensures gestures don't break when the cursor moves fast and leaves the note boundary. The `attachMouseListeners` utility encapsulates this pattern, handling both the attachment and cleanup on `mouseup`. The logic is extracted into `useNoteInteractions`, keeping the `Note` component purely presentational. During drag, coordinates flow up to `Board`, which decides whether the note overlaps the `TrashZone` — keeping the two components fully decoupled.

For performance, `Note` is wrapped in `memo` and all callbacks passed to it are wrapped in `useCallback` — in `useNotes` and in `Board`. This ensures that when one note updates, the rest do not re-render, since their props references stay stable.

`NoteColor` is defined as a union type rather than a plain `string`, so invalid colors are caught at compile time. CSS custom properties are used for all shared colors, making the palette easy to update from a single place.

Each component owns its CSS file, co-located in the same folder — this makes it immediately clear which styles belong to which component, simplifies deletion (removing a component means removing one folder), and avoids the risk of orphaned styles accumulating over time.
