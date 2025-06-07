import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import NotesForm from "./NotesForm";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  notesReducerIntf,
  NavigationState,
} from "../../TS_INTERFACE/gInterface";
import { editNote, removeNote } from "../../actions/AddNote";

const EditNotePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation() as { state: NavigationState | null };
  const { id } = useParams<{ id: string }>();
  const formRef = useRef<HTMLDivElement>(null);
  const [isFormVisible, setIsFormVisible] = useState(true);

  const note = useSelector((state: any) =>
    state.notes.find((note: notesReducerIntf) => note.id === id)
  );

  useEffect(() => {
    console.log("🔄 EditNotePage Mounted or Re-rendered");
  });

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

  if (!isFormVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center modal-overlay bg-black bg-opacity-50 z-50">
      <div ref={formRef} className="bg-white rounded-lg shadow-lg z-51">
        <NotesForm
          note={note}
          onSubmit={(note) => {
            if (id) {
              dispatch(editNote(id, note));
              setIsFormVisible(false);
            } else {
              console.log("id is not present");
            }
          }}
          onClose={() => {
            // *** Highlighted Change: Navigate based on fromSlot for Cancel ***
            const fromSlot = location.state?.fromSlot;
            if (fromSlot) {
              navigate("/notes/timeline", {
                state: { selectedSlot: fromSlot },
              });
            } else {
              navigate("/notes/timeline");
            }
            // *** End of Highlighted Change ***
          }}
        />
        <button
          onClick={() => {
            if (id) {
              dispatch(removeNote(id));
              const fromSlot = location.state?.fromSlot;
              if (fromSlot) {
                navigate("/notes/timeline", {
                  state: { selectedSlot: fromSlot },
                });
              } else {
                navigate("/notes/timeline");
              }
            } else {
              console.log("Entry not available to delete");
            }
          }}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default EditNotePage;
