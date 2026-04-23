import { useEffect, useState } from "react";
import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
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

export const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const [search, setSearch] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

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
    const fetchUsers = async () => {
      try {
        const res: ApiResponse = await Apiservice.get("/users");
        setUsers(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = (id: number) => {
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
    if (deleteId === null) return;

    try {
      await Apiservice.delete(`/users/${deleteId}`).then(
        (response: ApiResponse) => {
          setUsers((prev) => prev.filter((user) => user.id !== deleteId));
          toast.success(CONSTANT.SUCCESS.DELETE);
        },
      );
    } catch (error: any) {
      console.error(error);
      toast.error(CONSTANT.ERROR.COMMON);
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-user/${id}`);
  };

  const title = ["Name", "Age", "BirthDate", "Operations"];

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
        Get: async () => {
          await Apiservice.get(url).then((response: ApiResponse) => {
            toast.success(CONSTANT.SUCCESS.FETCH);
            console.log(response.status);
          });
        },
        Post: async () => {
          await Apiservice.post(url, newUser).then((response: ApiResponse) => {
            toast.success(CONSTANT.SUCCESS.CREATE);
            console.log(response.headers);
          });
        },
        Put: async () => {
          await Apiservice.put(url, newUser).then((response: ApiResponse) => {
            toast.success(CONSTANT.SUCCESS.UPDATE);
            console.log(response);
          });
        },
        Delete: async () => {
          await Apiservice.delete(url).then((response: ApiResponse) => {
            toast.success(CONSTANT.SUCCESS.DELETE);
            console.log(response);
          });
        },
      };
      await apiActions[method]();
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

      {showConfirm && (
        <Confirmation
          confirm={handleConfirm}
          cancel={handleCancel}
          message="Do You Really Want To Delete This Item ??"
        />
      )}
    </>
  );
};
