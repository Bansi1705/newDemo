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
import { TOASTER } from "../Services/CommonService/ToasterHelper";

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [IsLoadingUserList, setIsLoadingUserList] = useState<boolean>(true);
  const navigate = useNavigate();
  const [checkedDeleteUsers, setCheckedDeleteUsers] = useState<number[]>([]);
  const [selectedDropDownMonth, setSelectedDropDownMonth] =
    useState<string>("");
  const [searchUserByName, setSearchUserByName] = useState<string>("");
  const [isShowConfirmModel, setIsShowConfirmModel] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined);
  const [editId, setEditID] = useState<number | undefined>(undefined);
  const [showPreView, setShowPreview] = useState<boolean>(false);
  const [showPreviewImage, setShowPreviewImage] = useState<
    { name: string; url: string }[] | null
  >(null);
  const [weeks, setWeeks] = useState<Date[]>([
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  ]);

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
        TOASTER.ERROR.COMMON();
      } finally {
        setIsLoadingUserList(false);
      }
    };

    fetchUser();
  }, []);

  const handleDelete = (id: number | undefined) => {
    setDeleteId(id);
    setIsShowConfirmModel(true);
  };

  // useEffect(() => {
  //   const data = COMMON_SERVICES.getFiveYear();
  //   const NextData = COMMON_SERVICES.nextFiveYear();
  //   const NextMonths = COMMON_SERVICES.nextMonth();
  //   // console.log(data, NextData, NextMonths);
  // }, []);

  const handleConfirm = async () => {
    if (deleteId !== undefined) {
      try {
        await Apiservice.delete<ApiResponse<User[]>>(`/users/${deleteId}`);
        setUsers((prev) => prev.filter((user) => user.id !== deleteId));
        TOASTER.SUCCESS.DELETE();
      } catch {
        TOASTER.ERROR.COMMON();
      } finally {
        setIsShowConfirmModel(false);
        setDeleteId(undefined);
      }
    } else if (editId !== undefined) {
      navigate(`/edit-user/${editId}`);
      setIsShowConfirmModel(false);
      setEditID(undefined);
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
        TOASTER.SUCCESS.DELETE();
      } catch {
        TOASTER.ERROR.COMMON();
      }
    }
  };

  const handleCancel = () => {
    setIsShowConfirmModel(false);
    setDeleteId(undefined);
    setEditID(undefined);
    setCheckedDeleteUsers([]);
  };

  const handleEdit = (id: number | undefined) => {
    setIsShowConfirmModel(true);
    setEditID(id);
  };

  const title = [
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
            TOASTER.SUCCESS.FETCH()
          });
        },
        Post: () => {
          Apiservice.post<ApiResponse<User>>(url, newUser).then(() => {
            TOASTER.SUCCESS.CREATE()
          });
        },
        Put: () => {
          Apiservice.put<ApiResponse<User>>(url, newUser).then(() => {
            TOASTER.SUCCESS.UPDATE();
          });
        },
        Delete: () => {
          Apiservice.delete<ApiResponse<null>>(url).then(() => {
            TOASTER.SUCCESS.DELETE();
          });
        },
      };

      apiActions[method]();
    } catch (error) {
      console.error(error);
      TOASTER.ERROR.COMMON();
    }
  };

  const monthObj = COMMON_SERVICES.nextMonth();
  const months = Object.values(monthObj);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedDropDownMonth(value);
  };

  console.log(selectedDropDownMonth);

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
      : TOASTER.error("Please Select Item First !");

  // console.log(weeks);
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

            <h2 className="main-title">Users List</h2>

            <div className="table-wrapper">
              <table border={2} className="data-table">
                <thead>
                  <tr>
                    {title.map((head, index) => (
                      <th key={index}>{head}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {currentRecords.length === 0 ? (
                    <tr>
                      <td colSpan={title.length}>No Data Found</td>
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
                                    onClick={() => handleEdit(user.id)}
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
                                    onClick={() => handleDelete(user.id)}
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
            confirm={handleConfirm}
            cancel={handleCancel}
            type={deleteId !== undefined ? "delete" : "edit"}
            message={
              deleteId !== undefined
                ? "Do You Really Want To Delete This Item ??"
                : editId !== undefined
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
