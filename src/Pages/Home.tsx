import { useEffect, useState } from "react";
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
// import ImagePreview from "../Components/CommonComponents/FilePreview";

export const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const [search, setSearch] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | undefined>(undefined);
  const [editId, setEditID] = useState<number | undefined>(undefined);
  const [showPreView, setShowPreview] = useState<boolean>(false);
  const [showPreviewImage, setShowPreviewImage] = useState<File | undefined>(
    undefined,
  );

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
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setDeleteId(undefined);
    setEditID(undefined);
  };

  const handleEdit = (id: number | undefined) => {
    setShowConfirm(true);
    setEditID(id);
  };

  const title = ["Name", "Age", "BirthDate", "Image Preview", "Operations"];

  const handleApiTest = async (
    method: "Get" | "Post" | "Put" | "Delete",
    url: string,
  ) => {
    const newUser: User = {
      name: "bansi",
      age: 20,
      birthdate: "2026-04-12",
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

  const handleShowPreview = (image: File) => {
    setShowPreview(true);
    setShowPreviewImage(image);
  };

  // const handleOnClose = () => {
  //   setShowPreview(false);
  //   setShowPreviewImage(undefined);
  // };
  return (
    <>
      <Header search={search} setSearch={setSearch} searchShow={true} />

      <div className="user-data">
        <div className="table-section">
          <div className="apiButtons mb-4 flex gap-4 justify-center items-center">
            <Buttons
              label="Get"
              onClick={() => handleApiTest("Get", "/users")}
            />
            <Buttons
              label="Post"
              onClick={() => handleApiTest("Post", "/users")}
            />
            <Buttons
              label="Put"
              onClick={() => handleApiTest("Put", "/users/1")}
            />
            <Buttons
              label="Delete"
              onClick={() => handleApiTest("Delete", "/users/2")}
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
                {currentRecords.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.birthdate}</td>
                    <td>
                      <div className="imagePreviewIcon">
                        <MdOutlinePreview
                          size={30}
                          onClick={() => handleShowPreview(user.imageFile)}
                        />
                      </div>
                    </td>
                    <td className="action-buttons">
                      <Buttons
                        onClick={() => handleDelete(user.id)}
                        label={<MdDeleteOutline />}
                        className="delete-btn"
                      />
                      <Buttons
                        onClick={() => handleEdit(user.id)}
                        label={<CiEdit />}
                        className="edit-btn"
                      />
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
        <FilePreview file={showPreviewImage}/>
      )}

      {showConfirm && (
        <Confirmation
          confirm={handleConfirm}
          cancel={handleCancel}
          type={deleteId !== undefined ? "delete" : "edit"}
          message={
            deleteId
              ? "Do You Really Want To Delete This Item ??"
              : "Do You Want To Edit Item ??"
          }
        />
      )}
    </>
  );
};
