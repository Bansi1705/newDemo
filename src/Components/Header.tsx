import { NavLink } from "react-router-dom";
import { FaRegSun } from "react-icons/fa6";
import { FaRegMoon, FaSearch } from "react-icons/fa";
import "./Header.css";
import { useTheme } from "../Context/ThemeContext";

type HeaderProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

function Header({ search, setSearch }: HeaderProps) {
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

        <NavLink to="/" className="nav-item">
          LogOut
        </NavLink>
      </div>
      
      <div className="navbar-icons">
        <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search...."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
        <div  onClick={toggleTheme}>
        {theme === "dark" ? <FaRegSun /> : <FaRegMoon />}
      </div>

      </div>
      
    </div>
  );
}

export default Header;
