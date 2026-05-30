import "./TrashZone.css";
import { forwardRef } from "react";
import TrashIcon from "../../assets/icons/trash-full.svg?react";

export const TrashZone = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="trash-zone">
    <TrashIcon width={20} height={20} />
    <span>Drop to delete</span>
  </div>
));
