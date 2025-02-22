import { NavLink } from "react-router-dom";

const Header = () => (
  <header>
    <h1>EMP_TOOLS</h1>
    <p>
      <NavLink to={"/notes"} className={activeClassName} end>
        NOTES DASHBOARD
      </NavLink>
    </p>
    <p>
      <NavLink to={"/attendance"}> Attendance</NavLink>
    </p>
  </header>
);
const activeClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-is-active" : "";

export default Header;
