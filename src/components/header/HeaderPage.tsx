import { NavLink } from "react-router-dom";
import "../../styles/header/HeaderPage.css";
const Header = () => (
  <header>
    <h1 className="app-title text-white">EMP_TOOLS</h1>
    <p className="notes-dashboard text-white">
      <NavLink to={"/notes"} className={activeClassName} end>
        NOTES DASHBOARD
      </NavLink>
    </p>
    <p className="attendance-dashboard text-white">
      <NavLink to={"/attendance"}> ATTENDANCE DASHBOARD</NavLink>
    </p>
  </header>
);
const activeClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-is-active" : "";

export default Header;
