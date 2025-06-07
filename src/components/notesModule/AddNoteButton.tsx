import AddNoteForm from "./AddNoteForm";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Added for navigation
import { NavigationState } from "../../TS_INTERFACE/gInterface";

interface AddNoteButtonProps {
  onFormVisibilityChange: (isVisible: boolean) => void;
}

const AddNoteButton = ({ onFormVisibilityChange }: AddNoteButtonProps) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation() as { state: NavigationState | null };

  useEffect(() => {
    onFormVisibilityChange(isFormVisible);
  }, [isFormVisible, onFormVisibilityChange]);

  useEffect(() => {
    if (!isFormVisible) {
      // *** Highlighted Change: Navigate based on fromSlot for Click Outside ***
      const fromSlot = location.state?.fromSlot;
      if (fromSlot) {
        navigate("/notes/timeline", { state: { selectedSlot: fromSlot } });
      } else {
        navigate("/notes/timeline");
      }
      // *** End of Highlighted Change ***
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!formRef.current) return;

      const clickedElement = event.target as Node;
      const isOutside = !formRef.current.contains(clickedElement);

      const isMuiPicker = (element: Node | null): boolean => {
        let current = element;
        while (current) {
          if (current instanceof HTMLElement) {
            if (
              current.className?.includes("MuiPicker") ||
              current.className?.includes("MuiCalendarPicker") ||
              current.className?.includes("MuiClockPicker") ||
              current.getAttribute("role") === "dialog" ||
              current.getAttribute("role") === "menu"
            ) {
              return true;
            }
          }
          current = current.parentNode;
        }
        return false;
      };

      if (isOutside && !isMuiPicker(clickedElement)) {
        setIsFormVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFormVisible, navigate, location.state]);

  return (
    <>
      <button
        className="fixed bottom-6 right-4 h-13 w-50 ml-500 border-none outline-none bg-[#525b28] text-white text-sm px-3 py-2 cursor-pointer rounded-md mt-12 mb-12 z-40"
        onClick={() => {
          setIsFormVisible(true);
        }}
      >
        Add Note
      </button>
      {isFormVisible && (
        <div className="fixed inset-0 flex items-center justify-center modal-overlay bg-black bg-opacity-50 z-50">
          <div
            ref={formRef}
            className="bg-white rounded-lg shadow-lg z-51"
            onClick={(e) => e.stopPropagation()}
          >
            <AddNoteForm
              onClose={() => {
                setIsFormVisible(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AddNoteButton;
