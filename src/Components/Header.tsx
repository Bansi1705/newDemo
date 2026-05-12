import { NavLink, useNavigate } from "react-router-dom";
import { FaRegSun } from "react-icons/fa6";
import { FaRegMoon, FaSearch } from "react-icons/fa";
// import "../Styles/Header.css";
import { useTheme } from "../Context/ThemeContext";
import { useState } from "react";
import Confirmation from "./CommonComponents/Confirmation";
import { toast } from "react-toastify";
import { Buttons } from "./CommonComponents/Buttons";
import { SearchBar } from "./CommonComponents/SearchComponent";
import { CONSTANT } from "../Services/Constant";

type HeaderProps = {
  search?: string;
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
  searchShow?: boolean;
};

function Header({ search, setSearch, searchShow }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [showCofirm, setShowConfirm] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    sessionStorage.removeItem("LoginUser");
    toast.success(CONSTANT.SUCCESS.LOGOUT);
    navigate("/");
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className="navbar flex items-center justify-between px-[15px] py-[30px] bg-blue-500 text-white w-full">
      <div className="text-2xl font-bold">
        <h1>UserDetail</h1>
      </div>
      <div className="navbar-links flex items-center justify-between gap-1 flex-nowrap">
        <NavLink
          to="/"
          className="nav-item text-white font-medium hover:text-gray-300 px-3 py-2 ml-2 whitespace-nowrap"
        >
          Home
        </NavLink>

        <NavLink
          to="/add-user"
          className="nav-item text-white font-medium hover:text-gray-300 px-3 py-2 ml-2 whitespace-nowrap"
        >
          Add User
        </NavLink>

        <NavLink
          to="/userExpense"
          className="nav-item text-white font-medium hover:text-gray-300 px-3 py-2 ml-2 whitespace-nowrap"
        >
          Add Expense
        </NavLink>

         <NavLink
          to="/data"
          className="nav-item text-white font-medium hover:text-gray-300 px-3 py-2 ml-2 whitespace-nowrap"
        >
          Data
        </NavLink>

        <NavLink
          to="/roomData"
          className="nav-item text-white font-medium hover:text-gray-300 px-3 py-2 ml-2 whitespace-nowrap"
        >
          Room Data
        </NavLink>
        <NavLink
          to="/propertyData"
          className="nav-item text-white font-medium hover:text-gray-300 px-3 py-2 ml-2 whitespace-nowrap"
        >
          Property Data
        </NavLink>
        <NavLink
          to="/property"
          className="nav-item text-white font-medium hover:text-gray-300 px-3 py-2 ml-2 whitespace-nowrap"
        >
          Property
        </NavLink>

         <NavLink
          to="/chartData"
          className="nav-item text-white font-medium hover:text-gray-300 px-3 py-2 ml-2 whitespace-nowrap"
        >
          Chart
        </NavLink>

        <Buttons
          onClick={handleLogout}
          label="LogOut"
          type="button"
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 transition-colors whitespace-nowrap"
        />
      </div>

      <div className="flex items-center gap-1">
        {searchShow && (
          <div className="search-container flex items-center gap-2 border border-gray-300 rounded px-2 py-1 bg-white text-black">
            <FaSearch className="search-icon text-base text-gray-500" />
            <SearchBar
              searchTerm={search}
              searchPlaceholder="Search...."
              searchOnChange={(e) => setSearch && setSearch(e.target.value)}
              searchClssName="text-sm focus:outline-none border-none bg-transparent"
            />
          </div>
        )}
        <div
          className="theme-toggle ml-2 rounded-full p-2 hover:bg-white hover:bg-opacity-10 text-xl cursor-pointer transition-colors"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <FaRegSun /> : <FaRegMoon />}
        </div>
      </div>

      {showCofirm && (
        <Confirmation
          type="Logout"
          confirm={handleConfirm}
          cancel={handleCancel}
          message="Do You Really Want To LogOut ??"
        />
      )}
    </div>
  );
}

export default Header;
