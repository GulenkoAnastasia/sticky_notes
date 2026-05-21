export const attachMouseListeners = (
  onMove: (e: MouseEvent) => void,
  onUp?: () => void,
) => {
  const handleMouseUp = () => {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", handleMouseUp);
    onUp?.();
  };
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", handleMouseUp);
};
