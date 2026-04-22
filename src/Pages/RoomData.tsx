import { useEffect, useState } from "react";
import Header from "../Components/Header";
import "../Styles/RoomData.css";
import type { RoomDataInterface } from "../Interface/types";
import { Apiservice } from "../Services/ApiService";
import { toast } from "react-toastify";
import { CONSTANT } from "../Services/Constant";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";
import { Buttons } from "../Components/CommonComponents/Buttons";
import { MdDeleteOutline } from "react-icons/md";
import Confirmation from "../Components/CommonComponents/Confirmation";
export const RoomData = () => {
  const [roomData, setRoomsData] = useState<RoomDataInterface[]>([]);
  const [showSubArray, setShowSubArray] = useState<boolean>(false);
  const [deleteRoomId, setDeleteRoomId] = useState<{
    index: number;
    subIndex?: number;
  } | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const tableHeader = [
    { label: "Sr NO.", key: "srNo" },
    { label: "Created Date", key: "createdAt" },
    { label: "Room Counts", key: "roomsCount" },
    { label: "Description", key: "description" },
    { label: "Created By", key: "isoDate" },
    { label: "Modified By", key: "modifiedBy" },
    { label: "Actions", key: "actions" },
  ];

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const res: Apiservice = await Apiservice.get("/dataRoom");
        setRoomsData(res.data);
      } catch {
        toast.error(CONSTANT.ERROR.NOT_FOUND);
      }
    };

    fetchRoomData();
  }, []);

  const handleDelete = (index: number, subIndex?: number) => {
    setDeleteRoomId({ index, subIndex });
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (!deleteRoomId) return;

    const { index, subIndex } = deleteRoomId;
    let newData = [...roomData];

    if (subIndex !== undefined) {
      newData[index].subArray = newData[index].subArray.filter(
        (_, i) => i !== subIndex,
      );
    } else {
      newData = newData.filter((_, i) => i !== index);
    }
    setRoomsData(newData);
    setDeleteRoomId(null);
    setShowConfirm(false);
  };

  return (
    <>
      <div>
        <Header />
        <div className="user-data">
          <div className="table-data">
            <div className="table-wrapper">
              <table border={2} className="data-table">
                <thead>
                  <tr>
                    {tableHeader.map((head, index) => (
                      <th key={index}>
                        <div className="flex items-center gap-1">
                          {head.label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {roomData.map((data: any, index: number) => (
                    <>
                      <tr key={index}>
                        {data.subArray.length !== 0 ? (
                          <>
                            <td className="flex justify-center items-center gap-2">
                              <span
                                className="cursor-pointer"
                                onClick={() => setShowSubArray(!showSubArray)}
                              >
                                {showSubArray ? (
                                  <FaMinus className="text-base font-bold scale-110" />
                                ) : (
                                  <FaPlus className="text-base font-bold scale-110" />
                                )}
                              </span>
                              <span>{index + 1}</span>
                            </td>
                          </>
                        ) : (
                          <td>{index + 1}</td>
                        )}

                        <td>{data.isoDate?.split("T")[0]}</td>
                        <td>{data.roomsCount}</td>
                        <td>{data.note}</td>
                        <td>{data.createdBy ? data.createdBy : "-"}</td>
                        <td>{data.modifiedBy ? data.modifiedBy : "-"}</td>
                        <td>
                          <Buttons
                            onClick={() => handleDelete(index)}
                            label={<MdDeleteOutline />}
                            className="delete-btn"
                          />
                        </td>
                      </tr>

                      {showSubArray &&
                        data.subArray.map((sub: any, subIndex: number) => (
                          <>
                            <tr key={subIndex} className="sub-row text-red-300">
                              <td>{subIndex + 1}</td>
                              <td>{sub.isoDate?.split("T")[0]}</td>
                              <td>{sub.roomsCount}</td>
                              <td>{sub.note}</td>
                              <td>{sub.createdBy ? sub.createdBy : "-"}</td>
                              <td>{sub.modifiedBy ? sub.modifiedBy : "-"}</td>
                              <td>
                                <Buttons
                                  onClick={() => handleDelete(index, subIndex)}
                                  label={<MdDeleteOutline />}
                                  className="delete-btn"
                                />
                              </td>
                            </tr>
                          </>
                        ))}
                    </>
                  ))}
                </tbody>
              </table>
              {showConfirm && (
                <Confirmation
                  confirm={confirmDelete}
                  cancel={() => setShowConfirm(false)}
                  message="Delete this Room Detail ?"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
