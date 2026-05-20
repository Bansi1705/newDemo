import { NavLink, useNavigate } from "react-router-dom";
import { FaChevronDown, FaRegSun } from "react-icons/fa6";
import { FaRegMoon, FaSearch } from "react-icons/fa";
// import "../Styles/Header.css";
import { useTheme } from "../Context/ThemeContext";
import React, { useState } from "react";
import Confirmation from "./CommonComponents/Confirmation";
import { toast } from "react-toastify";
import { Buttons } from "./CommonComponents/Buttons";
import { SearchBar } from "./CommonComponents/SearchComponent";
import { CONSTANT } from "../Services/Constant";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

type HeaderProps = {
  search?: string;
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
  searchShow?: boolean;
};

function Header({ search, setSearch, searchShow }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [showCofirm, setShowConfirm] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState("Pages");
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
console.log("header renders")
  return (
    <div className="navbar flex items-center justify-between px-[15px] py-[30px] bg-blue-500 text-white w-full">
      <div className="text-2xl font-bold">
        <h1>UserDetail</h1>
      </div>
      <div className="navbar-links flex items-center justify-between gap-1 flex-nowrap text-sm">
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
          + User
        </NavLink>

        <NavLink
          to="/userExpense"
          className="nav-item text-white font-medium hover:text-gray-300 px-3 py-2 ml-2 whitespace-nowrap"
        >
          + Expense
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
          to="/chartData"
          className="nav-item text-white font-medium hover:text-gray-300 px-3 py-2 ml-2 whitespace-nowrap"
        >
          Chart
        </NavLink>
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="flex items-center gap-1 text-white font-medium hover:text-gray-300 px-3 py-2 ml-2 whitespace-nowrap">
            {selectedTab}
            <FaChevronDown size={14} />
          </MenuButton>

          <MenuItems className="absolute right-0 mt-2 w-52 rounded-lg bg-white shadow-lg z-50 overflow-hidden">
            <MenuItem>
              <NavLink
                to="/property"
                onClick={() => setSelectedTab("Property")}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black"
              >
                Property
              </NavLink>
            </MenuItem>

            <MenuItem>
              <NavLink
                to="/propertyCard"
                onClick={() => setSelectedTab("Property Card")}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black"
              >
                Property Card
              </NavLink>
            </MenuItem>

            <MenuItem>
              <NavLink
                to="/propertyWiseCard"
                onClick={() => setSelectedTab("PropertyWise Card")}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black"
              >
                PropertyWise Card
              </NavLink>
            </MenuItem>
             <MenuItem>
              <NavLink
                to="/monthlyReport"
                onClick={() => setSelectedTab("MonthlyReport")}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black"
              >
                Monthly Report
              </NavLink>
            </MenuItem>
             <MenuItem>
              <NavLink
                to="/capitalExpense"
                onClick={() => setSelectedTab("MonthlyReport")}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black"
              >
                Capital Expense
              </NavLink>
            </MenuItem>
          </MenuItems>
        </Menu>

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

export default React.memo(Header);
