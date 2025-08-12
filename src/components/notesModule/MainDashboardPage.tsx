import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import "../../styles/header/HeaderPage.css";

const MainDashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(325);
  const isResizing = useRef(false);
  const [isNotesDropdownOpen, setIsNotesDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const buttonRef = useRef<HTMLDivElement>(null);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);
  };

  const resize = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = e.clientX;
    if (newWidth >= 50 && newWidth <= 325) {
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

  useEffect(() => {
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const button = buttonRef.current;
    if (button) {
      button.addEventListener("mouseenter", handleMouseEnter);
      button.addEventListener("mouseleave", handleMouseLeave);
    }
    return () => {
      if (button) {
        button.removeEventListener("mouseenter", handleMouseEnter);
        button.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isSidebarOpen]); // Re-run when sidebar state changes

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`bg-[#525b28] text-white h-full cursor-pointer transition-all duration-100 ease-in-out flex flex-col fixed top-0 left-0 z-3000 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full hidden"
        }`}
        style={{ width: `${isSidebarOpen ? sidebarWidth : 0}px` }}
      >
        {isSidebarOpen && (
          <div className="p-6 mt-10 ml-4 flex-1 overflow-y-auto">
            <ul
              className={`transition-all duration-300 ${
                isSidebarOpen && !isHovered
                  ? "-ml-3"
                  : isSidebarOpen && isHovered
                  ? "-ml-10"
                  : ""
              }`}
            >
              <li className="mb-4">
                <div
                  className={`block py-1 px-3 border cursor-pointer rounded-md ml-4 mt-10 transition delay-100 hover:bg-white hover:text-[#625b28] hover:ml-1 w-100 ${
                    isNotesDropdownOpen
                      ? "bg-white text-[#625b28] hover:bg-white hover:border-[#625b28] transition-all"
                      : ""
                  }`}
                  onClick={toggleNotesDropdown}
                >
                  <span className="text-4xl mt-5 flex-1">Notes Dashboard</span>
                  {isNotesDropdownOpen ? (
                    <ExpandLessIcon className="ml-2 flex-shrink-0" />
                  ) : (
                    <ExpandMoreIcon className="ml-2 flex-shrink-0" />
                  )}
                </div>
                {isNotesDropdownOpen && (
                  <ul className="mt-9 mb-3">
                    <li>
                      <Link
                        to="/notes/timeline"
                        className={`block text-3xl py-1 px-3 rounded-md ml-9 mt-5 hover:border hover:bg-white hover:text-[#625b28] hover:ml-1 w-100 ${
                          location.pathname === "/notes/timeline" && !isHovered
                            ? "bg-white text-[#625b28]"
                            : "hover:bg-white hover:text-[#625b28] group-hover:bg-transparent group-hover:text-white"
                        }`}
                        onClick={() => setIsHovered(false)}
                      >
                        Timeline
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/notes/list"
                        className={`block text-3xl py-1 px-3 rounded-md ml-9 mt-5 hover:border hover:bg-white hover:text-[#625b28] hover:ml-1 w-100 ${
                          location.pathname === "/notes/list"
                            ? "bg-white text-[#625b28]"
                            : "hover:bg-white hover:text-[#625b28] group-hover:bg-transparent group-hover:text-white"
                        }`}
                        onClick={() => setIsHovered(false)}
                      >
                        List View
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className="mt-5 mb-4">
                <Link
                  to="/attendance"
                  className="block text-4xl py-2 px-3 ml-4 mt-5 border rounded-md hover:bg-white hover:text-[#625b28] hover:-ml-1 transition-colors w-100"
                  onClick={() => setIsHovered(false)}
                >
                  Attendance Dashboard
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/"
                  className="block text-4xl py-2 px-3 ml-4 mt-5 border hover:-ml-1 rounded-md hover:bg-white hover:text-[#625b28] transition-colors break-words w-100"
                  onClick={() => setIsHovered(false)}
                >
                  Home
                </Link>
              </li>
            </ul>
          </div>
        )}
        {isSidebarOpen && (
          <div
            className="w-2 bg-[#525b28] cursor-col-resize hover:bg-[#725b28] absolute right-0 top-0 h-full select-none"
            onMouseDown={startResizing}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-1000">
        {!isSidebarOpen || isHovered ? (
          <div
            ref={buttonRef}
            className="fixed cursor-pointer top-8 w-8 h-8 left-4 z-50 rounded-full bg-black flex items-center justify-center transition z-3001"
            style={{ width: "20px", height: "20px" }}
            onClick={toggleSidebar}
            onMouseLeave={() => setIsHovered(false)}
          />
        ) : (
          <div
            className="fixed  top-8 w-8 h-8 left-4 z-50 rounded-full bg-white flex items-center justify-center z-3001"
            style={{ width: "20px", height: "20px" }}
            onClick={toggleSidebar}
          />
        )}
        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-112px)]">
          <Outlet context={{ isSidebarOpen, sidebarWidth }} />
        </div>
      </div>
    </div>
  );
};

export default MainDashboardPage;
