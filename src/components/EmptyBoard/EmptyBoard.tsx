import "./EmptyBoard.css";
import AddIcon from "../../assets/icons/add-plus-square.svg?react";

export const EmptyBoard = () => {
  return (
    <div className="empty-board-container">
      <div className="empty-board-hint">
        <AddIcon />
        <p>Double-click anywhere to add a note</p>
      </div>
    </div>
  );
};
