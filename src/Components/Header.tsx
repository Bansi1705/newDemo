import { NavLink, useNavigate } from "react-router-dom";
import { FaRegSun } from "react-icons/fa6";
import { FaRegMoon, FaSearch } from "react-icons/fa";
import "../Styles/Header.css";
import { useTheme } from "../Context/ThemeContext";
import { useState } from "react";
import Confirmation from "./CommonComponents/Confirmation";
import { toast } from "react-toastify";
import { Buttons } from "./CommonComponents/Buttons";
import { SearchBar } from "./CommonComponents/SearchComponent";

type HeaderProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  searchShow?: boolean;
};

function Header({ search, setSearch ,searchShow }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [showCofirm, setShowConfirm] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    sessionStorage.removeItem("LoginUser");
    toast.success("Logout Succesfully...");
    navigate("/");
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

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

        <NavLink to="/userExpense" className="nav-item">
          User Expense
        </NavLink>

        <Buttons onClick={handleLogout} label="LogOut" className="nav-item" />
      </div>

      <div className="navbar-icons">
        {searchShow && (
          <div className="search-container">
            <FaSearch className="search-icon" />
            <SearchBar
              searchTerm={search}
              searchPlaceholder="Search...."
            searchOnChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? <FaRegSun /> : <FaRegMoon />}
        </div>
      </div>

      {showCofirm && (
        <Confirmation
          confirm={handleConfirm}
          cancel={handleCancel}
          message="Do You Really Want To LogOut ??"
        />
      )}
    </div>
  );
}

export default Header;
