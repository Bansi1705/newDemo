// src/components/Header.tsx
import { NavLink } from "react-router-dom";
import { FaRegSun } from "react-icons/fa6";
import { FaRegMoon } from "react-icons/fa";
import "./Header.css";
import { useTheme } from "../Context/ThemeContext";

function Header() {
  const { theme, toggleTheme } = useTheme(); 

  return (
    <div className="navbar">
      <div>
        <h1>UserDetail</h1>
      </div>
      <div className="navbar-links">
        <NavLink to="/" className="nav-item">
          Home
        </NavLink>

        <NavLink to="/add-user" className="nav-item">
          Add User
        </NavLink>

        <NavLink to="/" className="nav-item" >
          LogOut
        </NavLink>
      </div>
      <div className="navbar-icons" onClick={toggleTheme}>
        {theme === "dark" ? <FaRegSun /> : <FaRegMoon />}
      </div>
    </div>
  );
}

export default Header;