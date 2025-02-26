import { NavLink } from "react-router-dom";
import "../../styles/header/HeaderPage.css";
const Header = () => (
  <header>
    <h1 className="app-title">EMP_TOOLS</h1>
    <p className="notes-dashboard">
      <NavLink to={"/notes"} className={activeClassName} end>
        NOTES DASHBOARD
      </NavLink>
    </p>
    <p className="attendance-dashboard">
      <NavLink to={"/attendance"}> ATTENDANCE DASHBOARD</NavLink>
    </p>
  </header>
);
const activeClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-is-active" : "";

export default Header;
