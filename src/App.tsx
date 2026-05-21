import { useState } from "react";
import type { NoteColor } from "./types";
import { Toolbar } from "./components/Toolbar";
import { Board } from "./components/Board";

function App() {
  const [selectedColor, setSelectedColor] = useState<NoteColor>("yellow");

  return (
    <>
      <Toolbar selectedColor={selectedColor} onColorChange={setSelectedColor} />
      <Board selectedColor={selectedColor} />
    </>
  );
}

export default App;
