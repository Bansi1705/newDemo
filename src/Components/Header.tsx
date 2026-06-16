import { NavLink, useNavigate } from "react-router-dom";
import { FaChevronDown, FaRegSun } from "react-icons/fa6";
import { FaRegMoon, FaSearch } from "react-icons/fa";
// import "../Styles/Header.css";
import { useTheme } from "../Context/ThemeContext";
import React, { useState } from "react";
import Confirmation from "./CommonComponents/Confirmation";
import { Buttons } from "./CommonComponents/Buttons";
import { SearchBar } from "./CommonComponents/SearchComponent";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import Toaster from "../Services/CommonService/ToasterHelper";
import { CONSTANT } from "../Services/Constant";
import { useLocation } from "react-router-dom";

export type HeaderProps = {
  searchTerm?: string;
  setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
  showSearchInput?: boolean;
};

function Header({ searchTerm, setSearchTerm, showSearchInput }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [showLogOutCofirm, setShowLogOutConfirm] = useState<boolean>(false);
  const navigate = useNavigate();
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const location = useLocation();

  const handleUserLogout = () => {
    setShowLogOutConfirm(true);
  };

  const handleUserLogOutConfirm = () => {
    sessionStorage.removeItem("LoginUser");
    Toaster.success(CONSTANT.TOAST_SUCCESS_MSG.LOGOUT);
    navigate("/");
  };

  const handleUserLogOutConfirmCancel = () => {
    setShowLogOutConfirm(false);
  };

  const navLinkList = [
    { to: "/home", name: "Home" },
    { to: "/add-user", name: "+ User" },
    { to: "/userExpense", name: "+ Expense" },
    { to: "/data", name: "Data" },
    { to: "/roomData", name: "RoomData" },
    { to: "/propertyData", name: "Property Data" },
    { to: "/chartData", name: "Charts" },
  ];

  const menuNavItems = [
    { to: "/property", name: "Property" },
    { to: "/propertyCard", name: "Property Card" },
    { to: "/propertyWiseCard", name: "PropertyWise Card" },
    { to: "/monthlyReport", name: "Monthly Report" },
    { to: "/capitalExpense", name: "Capital Expense" },
    { to: "/userProfile", name: "User Profile" },
    { to: "/payRollData", name: "Pay Roll Data" },
    { to: "/incidentreport", name: "Incident Report" },
  ];
  const currentItem = menuNavItems.find(
    (item) => item.to === location.pathname,
  );
  const selectedNavTab = currentItem ? currentItem.name : "Pages";

  return (
    <div className="navbar flex items-center justify-between px-[15px] py-[30px] bg-blue-500 text-white w-full">
      <div className="text-2xl font-bold">
        <h1>UserDetail</h1>
      </div>
      <div className="navbar-links flex items-center justify-between gap-1 flex-nowrap text-sm">
        <TabGroup
          selectedIndex={selectedTabIndex}
          onChange={setSelectedTabIndex}
        >
          <TabList>
            {navLinkList.map((item) => (
              <Tab
                key={item.to}
                onClick={() => navigate(item.to)}
                className="nav-item text-white font-medium hover:text-gray-300 px-3 py-2 ml-2 whitespace-nowrap"
              >
                {item.name}
              </Tab>
            ))}
          </TabList>

          <TabPanels className="hidden">
            {navLinkList.map((item) => (
              <TabPanel key={item.to}>{item.name}</TabPanel>
            ))}
          </TabPanels>
        </TabGroup>

        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="flex items-center gap-1 text-white font-medium hover:text-gray-300 px-3 py-2 ml-2 whitespace-nowrap">
            {selectedNavTab}
            <FaChevronDown size={14} />
          </MenuButton>
          <MenuItems className="absolute right-0 mt-2 w-52 rounded-lg bg-white shadow-lg z-50 overflow-hidden">
            {menuNavItems.map((item) => (
              <MenuItem key={item.to}>
                <NavLink
                  to={item.to}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black"
                >
                  {item.name}
                </NavLink>
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>

        <Buttons
          onClick={handleUserLogout}
          label="LogOut"
          type="button"
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 transition-colors whitespace-nowrap"
        />
      </div>

      <div className="flex items-center gap-1">
        {showSearchInput && (
          <div className="search-container flex items-center gap-2 border border-gray-300 rounded px-2 py-1 bg-white text-black">
            <FaSearch className="search-icon text-base text-gray-500" />
            <SearchBar
              searchTerm={searchTerm}
              searchPlaceholder="Search...."
              searchOnChange={(e) => setSearchTerm?.(e.target.value)}
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

      {showLogOutCofirm && (
        <Confirmation
          type="Logout"
          confirm={handleUserLogOutConfirm}
          cancel={handleUserLogOutConfirmCancel}
          message="Do You Really Want To LogOut ??"
        />
      )}
    </div>
  );
}

export default React.memo(Header);
