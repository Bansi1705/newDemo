import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline, MdOutlinePreview } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import "../Styles/Home.css";
import { toast } from "react-toastify";
import Confirmation from "../Components/CommonComponents/Confirmation";
import { Buttons } from "../Components/CommonComponents/Buttons";
import Pagination from "../Components/CommonComponents/Pagination";
import { Apiservice } from "../Services/ApiService";
import type { ApiResponse, User } from "../Interface/types";
import { CONSTANT } from "../Services/Constant";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";
import { DropDown } from "../Components/CommonComponents/DropDown";
import CommonMultiSelect from "../Components/CommonComponents/MultipleDropDowm";
import FilePreview from "../Components/CommonComponents/FilePreview";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CustomDateRangePicker from "../Components/CommonComponents/DatePickerBasic";
import WeekPicker from "../Components/CommonComponents/WeekPicker";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

export const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const [checkedDelete, setCheckedDelete] = useState<number[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined);
  const [editId, setEditID] = useState<number | undefined>(undefined);
  const [showPreView, setShowPreview] = useState<boolean>(false);
  const [showPreviewImage, setShowPreviewImage] = useState<
    File | string | null
  >(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  const lastIndex = currentPage * itemsPerPage;
  const startIndex = lastIndex - itemsPerPage;
  const currentRecords = filteredUsers.slice(startIndex, lastIndex);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response: ApiResponse<User[]> = await Apiservice.get("/users");
        setUsers(response.data);
      } catch {
        toast.error(CONSTANT.ERROR.COMMON);
      }
    };

    
    fetchUser();
  }, []);

  const handleDelete = (id: number | undefined) => {
    setDeleteId(id);
    setShowConfirm(true);
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
        toast.success(CONSTANT.SUCCESS.DELETE);
      } catch {
        toast.error(CONSTANT.ERROR.COMMON);
      } finally {
        setShowConfirm(false);
        setDeleteId(undefined);
      }
    } else if (editId !== undefined) {
      navigate(`/edit-user/${editId}`);
      setShowConfirm(false);
      setEditID(undefined);
    } else if (checkedDelete.length > 0) {
      try {
        checkedDelete.map(async (id) => {
          await Apiservice.delete<ApiResponse<User[]>>(`/users/${id}`);
          setUsers((prev) =>
            prev.filter((user) => !checkedDelete.includes(user.id ?? 0)),
          );
        });
        setCheckedDelete([]);
        setShowConfirm(false);
        toast.success(CONSTANT.SUCCESS.DELETE);
      } catch {
        toast.error(CONSTANT.ERROR.COMMON);
      }
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setDeleteId(undefined);
    setEditID(undefined);
    setCheckedDelete([]);
  };

  const handleEdit = (id: number | undefined) => {
    setShowConfirm(true);
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
      uploadFile: null,
    };

    try {
      const apiActions = {
        Get: () => {
          Apiservice.get<ApiResponse<User[]>>(url).then(() => {
            toast.success(CONSTANT.SUCCESS.FETCH);
          });
        },
        Post: () => {
          Apiservice.post<ApiResponse<User>>(url, newUser).then(() => {
            toast.success(CONSTANT.SUCCESS.CREATE);
          });
        },
        Put: () => {
          Apiservice.put<ApiResponse<User>>(url, newUser).then(() => {
            toast.success(CONSTANT.SUCCESS.UPDATE);
          });
        },
        Delete: () => {
          Apiservice.delete<ApiResponse<null>>(url).then(() => {
            toast.success(CONSTANT.SUCCESS.DELETE);
          });
        },
      };

      apiActions[method]();
    } catch (error) {
      console.error(error);
      toast.error(CONSTANT.ERROR.COMMON);
    }
  };

  const monthObj = COMMON_SERVICES.nextMonth();
  const months = Object.values(monthObj);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedMonth(value);
  };

  // console.log(selectedMonth);

  const [showItems, setShowItems] = useState([
    { label: "BCA", value: "bca" },
    { label: "BBA", value: "bba" },
    { label: "BA", value: "ba" },
    { label: "BCOM", value: "bcom" },
    { label: "BVOC", value: "bvoc" },
  ]);

  const handleShowPreview = (file: File | string | null) => {
    setShowPreview(true);
    setShowPreviewImage(file);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setShowPreviewImage(null);
  };

  const handleCheckBoxDeleteChange = (id: number | undefined) => {
    setCheckedDelete((prev) =>
      prev.includes(id ?? 0)
        ? prev.filter((item) => item !== id)
        : [...prev, id ?? 0],
    );
  };

  const handleCheckedDelete = () => {
    setShowConfirm(true);
  };

  const name = "bansi";
  console.log(name);
  return (
    <>
      <Header
        search={search}
        setSearch={setSearch}
        searchShow={true}
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
              selectValue={selectedMonth}
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
              className="px-3"
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
                {currentRecords.map((user, index) => (
                  <tr key={user.id}>
                    <td>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={() =>
                              handleCheckBoxDeleteChange(user.id ?? 0)
                            }
                            checked={checkedDelete.includes(user.id ?? 0)}
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
                ))}
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

      {showConfirm && (
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
  );
};
