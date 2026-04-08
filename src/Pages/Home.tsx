import { useEffect, useState } from "react";
import Header from "../Components/Header";
import type { User } from "../types";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import "../Styles/Home.css";
import { toast } from "react-toastify";
import Confirmation from "../Components/CommonComponents/Confirmation";
import { Buttons } from "../Components/CommonComponents/Buttons";

export const Home = () => {
  const [users, setUsers] = useState<User[]>([]);

  const navigate = useNavigate();

  const [search, setSearch] = useState<string>("");

  const [showCofirm, setShowConfirm] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const lastIndex = currentPage * itemsPerPage;
  const startIndex = lastIndex - itemsPerPage;

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const currentRecords = filteredUsers.slice(startIndex, lastIndex);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data));
  }, []);

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    await fetch(`http://localhost:5000/users/${deleteId}`, {
      method: "DELETE",
    });
    setUsers((prev) => prev.filter((user) => user.id !== deleteId));
    setShowConfirm(false);
    setDeleteId(null);
    toast.success("Deleted .....");
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-user/${id}`);
  };

  const title = ["Name", "Age", "BirthDate", "Operations"];

  return (
    <>
      <Header
        search={search}
        setSearch={setSearch}
          searchShow={true}
      />

      <div className="user-data">
        <div className="table-section">
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
            <div className="pagination-controls">
              <Buttons
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                label="Previous"
                className="pagination-button"
              />
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Buttons
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                label="Next"
                className="pagination-button"
              />
            </div>
          </div>
          {showCofirm && (
            <Confirmation
              confirm={handleConfirm}
              cancel={handleCancel}
              message=" Do You Really Want To Delete This Item ??"
            />
          )}
        </div>
      </div>
    </>
  );
};
