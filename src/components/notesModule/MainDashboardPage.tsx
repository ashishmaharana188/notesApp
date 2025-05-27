import { useState, useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import "../../styles/header/HeaderPage.css";

const MainDashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const isResizing = useRef(false);
  const [isNotesDropdownOpen, setIsNotesDropdownOpen] = useState(false);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);
  };

  const resize = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = e.clientX;
    if (newWidth >= 240 && newWidth <= 500) {
      setSidebarWidth(newWidth);
    }
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResizing);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleNotesDropdown = () => {
    setIsNotesDropdownOpen(!isNotesDropdownOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`bg-[#525b28] text-white h-full transition-all duration-300 ease-in-out flex flex-col fixed top-0 left-0 z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full hidden"
        }`}
        style={{ width: `${isSidebarOpen ? sidebarWidth : 0}px` }}
      >
        {isSidebarOpen && (
          <div className="p-6 flex-1 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 break-words text-center">
              EMP_TOOLS
            </h2>
            <ul>
              <li className="mb-4">
                <div
                  className="flex items-center justify-between cursor-pointer py-2 px-3 rounded-md hover:bg-[#625b28] transition-colors max-w-full"
                  onClick={toggleNotesDropdown}
                >
                  <span className="text-lg break-words flex-1 pr-2">
                    Notes Dashboard
                  </span>
                  {isNotesDropdownOpen ? (
                    <ExpandLessIcon className="ml-2 flex-shrink-0" />
                  ) : (
                    <ExpandMoreIcon className="ml-2 flex-shrink-0" />
                  )}
                </div>
                {isNotesDropdownOpen && (
                  <ul className="pl-4 mt-2 space-y-2">
                    <li>
                      <Link
                        to="/notes/timeline"
                        className="block py-2 px-3 rounded-md hover:bg-[#625b28] transition-colors break-words max-w-full"
                      >
                        Timeline
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/notes/list"
                        className="block py-2 px-3 rounded-md hover:bg-[#625b28] transition-colors break-words max-w-full"
                      >
                        List View
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className="mb-4">
                <Link
                  to="/attendance"
                  className="block py-2 px-3 rounded-md hover:bg-[#625b28] transition-colors break-words max-w-full"
                >
                  Attendance Dashboard
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/"
                  className="block py-2 px-3 rounded-md hover:bg-[#625b28] transition-colors break-words max-w-full"
                >
                  Home
                </Link>
              </li>
            </ul>
          </div>
        )}
        {isSidebarOpen && (
          <div
            className="w-2 bg-[#625b28] cursor-col-resize hover:bg-[#725b28] absolute right-0 top-0 h-full select-none"
            onMouseDown={startResizing}
          />
        )}
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? `pl-[${sidebarWidth}px]` : "pl-0"
        }`}
      >
        {/* Toggle Sidebar Button */}
        <button
          onClick={toggleSidebar}
<<<<<<< HEAD
          className="p-2 bg-[#525b28] text-white fixed top-4 left-4 z-50 rounded-md hover:bg-[#625b28]/80 transition-colors"
=======
          className=" text-white fixed top-4 left-4 z-50 rounded-md hover:bg-[#625b28]/80 transition-colors"
>>>>>>> 278961d95c30f1f1b76fffc28f3395983f5fb75d
        >
          <MenuIcon />
        </button>

        {/* Dashboard Content */}
        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-112px)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainDashboardPage;
