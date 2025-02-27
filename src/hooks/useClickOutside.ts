import { useEffect } from "react";

/**
 * This Hook can be used for detecting clicks outside the Opened Menu
 */
const useClickOutside = (
  ref: React.RefObject<HTMLElement | null>,
  currentStatus: boolean,
  onClickOutside: () => void
) => {
  useEffect(() => {
    /**
     * Invoke Function onClick outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        currentStatus
      ) {
        onClickOutside();
      }
    }
    // Bind
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // dispose
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClickOutside, currentStatus]);

  return ref;
};

export default useClickOutside;
