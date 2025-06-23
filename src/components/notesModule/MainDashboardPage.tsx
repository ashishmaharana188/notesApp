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
          <div className="p-6 mt-10 ml-4 flex-1 overflow-y-auto">
            <ul>
              <li className="mb-4">
                <div
                  className="block py-1 px-3 border rounded-md ml-10 mt-5 transition delay-10 hover:bg-[#625b28] hover:ml-1 transition-colors break-words w-70"
                  onClick={toggleNotesDropdown}
                >
                  <span className="text-2xl mt-5 break-words flex-1">
                    Notes Dashboard
                  </span>
                  {isNotesDropdownOpen ? (
                    <ExpandLessIcon className="ml-2 flex-shrink-0" />
                  ) : (
                    <ExpandMoreIcon className="ml-2 flex-shrink-0" />
                  )}
                </div>
                {isNotesDropdownOpen && (
                  <ul className="pl-4 mt-5 space-y-2">
                    <li>
                      <Link
                        to="/notes/timeline"
                        className="block py-1 px-3 rounded-md ml-9 mt-5 border transition delay-10 hover:bg-[#625b28] hover:ml-1 transition-colors break-words w-60"
                      >
                        Timeline
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/notes/list"
                        className="block py-1 px-3 rounded-md ml-9 mt-5 border transition delay-100 hover:bg-[#625b28] hover:-ml-1 transition-colors break-words w-60"
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
                  className="block py-2 px-3 ml-7 mt-5  rounded-md hover:bg-[#625b28] transition-colors break-words max-w-full"
                >
                  Attendance Dashboard
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/"
                  className="block py-2 px-3 ml-7 mt-5  rounded-md hover:bg-[#625b28] transition-colors break-words max-w-full"
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
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Toggle Sidebar Button */}
        <button
          onClick={toggleSidebar}
          className=" text-white fixed top-8 w-8 h-8 left-4 z-50 rounded-md bg-white transition-colors"
        >
          <MenuIcon />
        </button>

        {/* Dashboard Content */}
        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-112px)]">
          <Outlet context={{ isSidebarOpen, sidebarWidth }} />
        </div>
      </div>
    </div>
  );
};

export default MainDashboardPage;
