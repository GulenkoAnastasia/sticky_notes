import "./TrashZone.css";
import { forwardRef } from "react";
import TrashIcon from "../../assets/icons/trash-full.svg?react";

interface TrashZoneProps {
  isOver: boolean;
}

export const TrashZone = forwardRef<HTMLDivElement, TrashZoneProps>(
  ({ isOver }, ref) => (
    <div ref={ref} className={`trash-zone ${isOver ? "over" : ""}`}>
      <TrashIcon width={20} height={20} />
      <span>Drop to delete</span>
    </div>
  ),
);
