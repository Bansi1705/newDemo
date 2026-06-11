import { useEffect, useState } from "react";
import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline, MdOutlinePreview } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import "../Styles/Home.css";
import Confirmation from "../Components/CommonComponents/Confirmation";
import { Buttons } from "../Components/CommonComponents/Buttons";
import Pagination from "../Components/CommonComponents/Pagination";
import { Apiservice } from "../Services/ApiService";
import type { ApiResponse, User } from "../Interface/types";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";
import { DropDown } from "../Components/CommonComponents/DropDown";
import CommonMultiSelect from "../Components/CommonComponents/MultipleDropDowm";
import FilePreview from "../Components/CommonComponents/FilePreview";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CustomDateRangePicker from "../Components/CommonComponents/DatePickerBasic";
import WeekPicker from "../Components/CommonComponents/WeekPicker";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { MultipleWeekPicker } from "../Components/CommonComponents/MultiWeekSelect";
import { startOfWeek } from "date-fns";
import Loader from "../Components/CommonComponents/Loader";
import Toaster from "../Services/CommonService/ToasterHelper";
import { CONSTANT } from "../Services/Constant";
import MultipleMonthPicker from "../Components/CommonComponents/MultipleMonthPicker";
import "react-datepicker/dist/react-datepicker.css";
import YearPicker from "../Components/CommonComponents/YearPicker";
import SingleMonthPicker from "../Components/CommonComponents/SingleMonthSelect";

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [IsLoadingUserList, setIsLoadingUserList] = useState<boolean>(true);
  const navigate = useNavigate();
  const [checkedDeleteUsers, setCheckedDeleteUsers] = useState<number[]>([]);
  const [selectedDropDownMonth, setSelectedDropDownMonth] =
    useState<string>("");
  const [searchUserByName, setSearchUserByName] = useState<string>("");
  const [isShowConfirmModel, setIsShowConfirmModel] = useState<boolean>(false);
  const [deleteUserId, setDeleteUserId] = useState<number | undefined>(
    undefined,
  );
  const [editUserId, setEditUserID] = useState<number | undefined>(undefined);
  const [showPreView, setShowPreview] = useState<boolean>(false);
  const [showPreviewImage, setShowPreviewImage] = useState<
    { name: string; url: string }[] | null
  >(null);
  const [weeks, setWeeks] = useState<Date[]>([
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  ]);
  const currentYear = new Date().getFullYear();
  const [selectedMultipleMonths, setSelectedMultipleMonths] = useState<
    [Date | null, Date | null]
  >([new Date(currentYear, 0, 1), new Date(currentYear, 0, 31)]);
  const [selectedSingleMonth, setSelectedSingleMonth] = useState<Date | null>(
    new Date(currentYear, 0, 1),
  );

  const [selectedYear, setSelectedYear] = useState<Date | null>(new Date());

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchUserByName.toLowerCase()),
  );

  const lastIndex = currentPage * itemsPerPage;
  const startIndex = lastIndex - itemsPerPage;
  const currentRecords = filteredUsers.slice(startIndex, lastIndex);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchUserByName]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoadingUserList(true);
        const response: ApiResponse<User[]> = await Apiservice.get("/users");
        setUsers(response.data);
      } catch {
        Toaster.error(CONSTANT.TOAST_ERROR_MSG.COMMON);
      } finally {
        setIsLoadingUserList(false);
      }
    };

    fetchUser();
  }, []);

  const handleDeleteUser = (id: number | undefined) => {
    setDeleteUserId(id);
    setIsShowConfirmModel(true);
  };

  // useEffect(() => {
  //   const data = COMMON_SERVICES.getFiveYear();
  //   const NextData = COMMON_SERVICES.nextFiveYear();
  //   const NextMonths = COMMON_SERVICES.nextMonth();
  //   // console.log(data, NextData, NextMonths);
  // }, []);

  const handleConfirmDeleteEditUser = async () => {
    if (deleteUserId !== undefined) {
      try {
        await Apiservice.delete<ApiResponse<User[]>>(`/users/${deleteUserId}`);
        setUsers((prev) => prev.filter((user) => user.id !== deleteUserId));
        Toaster.success(CONSTANT.TOAST_SUCCESS_MSG.DELETE);
      } catch {
        Toaster.error(CONSTANT.TOAST_ERROR_MSG.COMMON);
      } finally {
        setIsShowConfirmModel(false);
        setDeleteUserId(undefined);
      }
    } else if (editUserId !== undefined) {
      navigate(`/edit-user/${editUserId}`);
      setIsShowConfirmModel(false);
      setEditUserID(undefined);
    } else if (checkedDeleteUsers.length > 0) {
      try {
        checkedDeleteUsers.map(async (id) => {
          await Apiservice.delete<ApiResponse<User[]>>(`/users/${id}`);
          setUsers((prev) =>
            prev.filter((user) => !checkedDeleteUsers.includes(user.id ?? 0)),
          );
        });
        setCheckedDeleteUsers([]);
        setIsShowConfirmModel(false);
        Toaster.success(CONSTANT.TOAST_SUCCESS_MSG.DELETE);
      } catch {
        Toaster.error(CONSTANT.TOAST_ERROR_MSG.COMMON);
      }
    }
  };

  const handleConfirmCancelDeleteEditUser = () => {
    setIsShowConfirmModel(false);
    setDeleteUserId(undefined);
    setEditUserID(undefined);
    setCheckedDeleteUsers([]);
  };

  const handleEditUser = (id: number | undefined) => {
    setIsShowConfirmModel(true);
    setEditUserID(id);
  };

  const userTableTitle = [
    "Sr.No",
    "Name",
    "Age",
    "BirthDate",
    "Image Preview",
    "Operations",
  ];

  const handleApiTest = async (
    method: "Get" | "Post" | "Put" | "Delete",
    url: string,
  ) => {
    const newUser: User = {
      name: "bansi",
      age: 20,
      birthdate: "2026-04-12",
      uploadFile: [],
    };

    try {
      const apiActions = {
        Get: () => {
          Apiservice.get<ApiResponse<User[]>>(url).then(() => {
            Toaster.success(CONSTANT.TOAST_SUCCESS_MSG.FETCH);
          });
        },
        Post: () => {
          Apiservice.post<ApiResponse<User>>(url, newUser).then(() => {
            Toaster.success(CONSTANT.TOAST_SUCCESS_MSG.CREATE);
          });
        },
        Put: () => {
          Apiservice.put<ApiResponse<User>>(url, newUser).then(() => {
            Toaster.success(CONSTANT.TOAST_SUCCESS_MSG.UPDATE);
          });
        },
        Delete: () => {
          Apiservice.delete<ApiResponse<null>>(url).then(() => {
            Toaster.success(CONSTANT.TOAST_SUCCESS_MSG.DELETE);
          });
        },
      };

      apiActions[method]();
    } catch (error) {
      console.error(error);
      Toaster.error(CONSTANT.TOAST_ERROR_MSG.COMMON);
    }
  };

  const monthObj = COMMON_SERVICES.nextMonth();
  const months = Object.values(monthObj);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedDropDownMonth(value);
  };

  // console.log(selectedDropDownMonth);

  const [showItems, setShowItems] = useState([
    { label: "BCA", value: "bca" },
    { label: "BBA", value: "bba" },
    { label: "BA", value: "ba" },
    { label: "BCOM", value: "bcom" },
    { label: "BVOC", value: "bvoc" },
  ]);

  const handleShowPreview = (file: { name: string; url: string }[]) => {
    setShowPreview(true);
    setShowPreviewImage(file);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setShowPreviewImage([]);
  };

  const handleCheckBoxDeleteChange = (id: number | undefined) => {
    setCheckedDeleteUsers((prev) =>
      prev.includes(id ?? 0)
        ? prev.filter((item) => item !== id)
        : [...prev, id ?? 0],
    );
  };

  const handleCheckedDelete = () =>
    checkedDeleteUsers.length != 0
      ? setIsShowConfirmModel(true)
      : Toaster.error(CONSTANT.TOAST_ERROR_MSG.DATA_NOT_SELECTED);

  const monthName = COMMON_SERVICES.nextMonth();

  const multipleMonths = selectedMultipleMonths?.map(
    (i) => i && monthName[i?.getMonth() + 1],
  );
  console.log("Multiple Month", multipleMonths);
  console.log("Selcted Year", selectedYear?.getFullYear());
  console.log(
    "single ",
    selectedSingleMonth && monthName[selectedSingleMonth?.getMonth() + 1],
  );
  return (
    <>
      <>
        <Header
          searchTerm={searchUserByName}
          setSearchTerm={setSearchUserByName}
          showSearchInput={true}
        />
        <div className="user-data">
          <div className="table-section">
            <div className="apiButtons mb-4 flex gap-4 justify-center items-center">
              <Buttons
                label="Get"
                onClick={() => handleApiTest("Get", "/users")}
                className="bg-blue-500 px-3 py-2 rounded cursor-pointer"
              />
              <Buttons
                label="Post"
                onClick={() => handleApiTest("Post", "/users")}
                className="bg-blue-500 px-3 py-2 rounded cursor-pointer"
              />
              <Buttons
                label="Put"
                onClick={() => handleApiTest("Put", "/users/1")}
                className="bg-blue-500 px-3 py-2 rounded cursor-pointer"
              />
              <Buttons
                label="Delete"
                onClick={() => handleApiTest("Delete", "/users/2")}
                className="bg-blue-500 px-3 py-2 rounded cursor-pointer"
              />

              <DropDown
                optionsLabel={months}
                selectClasName="setectBirth m-4 outline-1 color-white bg-#f9f9f9"
                selectValue={selectedDropDownMonth}
                dropDownChange={handleMonthChange}
                selectName="userMonth"
              />

              <CommonMultiSelect
                options={showItems}
                setOption={setShowItems}
                placeHolder="Select Course"
                isAdd={true}
                isDelete={true}
              />
              <Buttons
                label={"Delete Selected Item"}
                className="p-3 bg-blue-600"
                onClick={handleCheckedDelete}
              />
            </div>

            <div className="date-picker-section">
              <CustomDateRangePicker />

              <WeekPicker
                startYear={2025}
                startMonth={1}
                endYear={2027}
                endMonth={10}
              />

              <MultipleWeekPicker selectedWeeks={weeks} onChange={setWeeks} />
            </div>

            <div className="month-picker-section flex align-center justify-center gap-3 p-2 bg-slate-800">
              <MultipleMonthPicker
                setSelectedMultipleMonths={setSelectedMultipleMonths}
                selectedMultipleMonths={selectedMultipleMonths}
              />

              <SingleMonthPicker
                selectSingleMonth={selectedSingleMonth}
                setSelectSingleMonth={setSelectedSingleMonth}
              />

              <YearPicker
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
              />
            </div>

            <h2 className="main-title">Users List</h2>

            <div className="table-wrapper">
              <table border={2} className="data-table">
                <thead>
                  <tr>
                    {userTableTitle.map((head, index) => (
                      <th key={index}>{head}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {currentRecords.length === 0 ? (
                    <tr>
                      <td colSpan={userTableTitle.length}>No Data Found</td>
                    </tr>
                  ) : (
                    currentRecords.map((user, index) => (
                      <tr key={user.id}>
                        <td>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={() =>
                                  handleCheckBoxDeleteChange(user.id ?? 0)
                                }
                                checked={checkedDeleteUsers.includes(
                                  user.id ?? 0,
                                )}
                              />
                            }
                            label=""
                          />
                          {index + 1}
                        </td>
                        <td>{user.name}</td>
                        <td>{user.age}</td>
                        <td>{user.birthdate}</td>
                        <td>
                          <div className="imagePreviewIcon">
                            <MdOutlinePreview
                              size={30}
                              onClick={() => handleShowPreview(user.uploadFile)}
                            />
                          </div>
                        </td>
                        <td className="action-buttons">
                          <Menu
                            as="div"
                            className="relative inline-block text-left"
                          >
                            <MenuButton className="bg-blue-500 px-3 py-2 rounded cursor-pointer">
                              Actions
                            </MenuButton>
                            <MenuItems className="absolute right-0 mb-2 w-40 bg-white border rounded shadow-lg z-50">
                              <MenuItem>
                                {() => (
                                  <Buttons
                                    onClick={() => handleEditUser(user.id)}
                                    label={
                                      <>
                                        <CiEdit />
                                        Edit
                                      </>
                                    }
                                    className="edit-btn"
                                  />
                                )}
                              </MenuItem>

                              <MenuItem>
                                {() => (
                                  <Buttons
                                    onClick={() => handleDeleteUser(user.id)}
                                    label={
                                      <>
                                        <MdDeleteOutline />
                                        Delete
                                      </>
                                    }
                                    className="delete-btn"
                                  />
                                )}
                              </MenuItem>
                            </MenuItems>
                          </Menu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>

        {showPreView && (
          <FilePreview file={showPreviewImage} onClose={handleClosePreview} />
        )}

        {isShowConfirmModel && (
          <Confirmation
            confirm={handleConfirmDeleteEditUser}
            cancel={handleConfirmCancelDeleteEditUser}
            type={deleteUserId !== undefined ? "delete" : "edit"}
            message={
              deleteUserId !== undefined
                ? "Do You Really Want To Delete This Item ??"
                : editUserId !== undefined
                  ? "Do You Want To Edit This Item ??"
                  : "Do You Want To Delete All Selected Items ??"
            }
          />
        )}
      </>

      {IsLoadingUserList && <Loader />}
    </>
  );
};

export default Home;
