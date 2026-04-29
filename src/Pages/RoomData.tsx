import { useEffect, useState } from "react";
import Header from "../Components/Header";
import "../Styles/RoomData.css";
import type { ApiResponse, RoomDataInterface } from "../Interface/types";
import { Apiservice } from "../Services/ApiService";
import { toast } from "react-toastify";
import { CONSTANT } from "../Services/Constant";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";
import { Buttons } from "../Components/CommonComponents/Buttons";
import { MdDeleteOutline } from "react-icons/md";
import Confirmation from "../Components/CommonComponents/Confirmation";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export const RoomData = () => {
  const [roomData, setRoomsData] = useState<RoomDataInterface[]>([]);
  const [showSubArray, setShowSubArray] = useState<boolean>(false);
  const [deleteRoomId, setDeleteRoomId] = useState<{
    index: number;
    subIndex?: number;
  } | null>(null);

  const [checkedDelete, setCheckedDelete] = useState<{
    index: number[];
    subIndex?: number[];
  }>({
    index: [],
    subIndex: [],
  });

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
        const res: ApiResponse<RoomDataInterface[]> =
          await Apiservice.get("/dataRoom");
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
    let newData = [...roomData];

    if (deleteRoomId) {
      const { index, subIndex } = deleteRoomId;

      if (subIndex !== undefined) {
        newData[index].subArray = newData[index].subArray.filter(
          (_, i) => i !== subIndex,
        );
      } else {
        newData = newData.filter((_, i) => i !== index);
      }

      setDeleteRoomId(null);
    } else {
      newData = newData.filter((_, i) => !checkedDelete.index.includes(i));
      newData = newData.map((room) => ({
        ...room,
        subArray: room.subArray.filter(
          (_, i) => !checkedDelete.subIndex?.includes(i),
        ),
      }));

      setCheckedDelete({
        index: [],
        subIndex: [],
      });
    }

    setRoomsData(newData);
    setShowConfirm(false);
  };

  const handleCheckBoxDeleteChange = (index: number, subIndex?: number) => {
    if (subIndex !== undefined) {
      setCheckedDelete((prev) => ({
        ...prev,
        subIndex: prev?.subIndex?.includes(subIndex)
          ? prev.subIndex.filter((item) => item !== subIndex)
          : [...prev.subIndex, subIndex],
      }));
    } else {
      setCheckedDelete((prev) => ({
        ...prev,
        index: prev.index.includes(index)
          ? prev.index.filter((item) => item !== index)
          : [...prev.index, index],
      }));
    }
  };

  const handleCheckedDelete = () => {
    setShowConfirm(true);
  };

  return (
    <>
      <div>
        <Header />
        <div className="user-data">
          <div className="table-data">
            <div className="table-wrapper">
              <Buttons
                label={"Delete Selected Item"}
                onClick={handleCheckedDelete}
                className="delete-selected-btn"
              />
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
                  {roomData.map((data: RoomDataInterface, index: number) => (
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
                              <span>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={() =>
                                        handleCheckBoxDeleteChange(index)
                                      }
                                      checked={checkedDelete.index.includes(
                                        index,
                                      )}
                                    />
                                  }
                                  label=""
                                />
                                {index + 1}
                              </span>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={() =>
                                      handleCheckBoxDeleteChange(index)
                                    }
                                    checked={checkedDelete.index.includes(
                                      index,
                                    )}
                                  />
                                }
                                label=""
                              />
                              {index + 1}
                            </td>
                          </>
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
                        data.subArray.map(
                          (sub: RoomDataInterface, subIndex: number) => (
                            <>
                              <tr
                                key={subIndex}
                                className="sub-row text-red-300"
                              >
                                <td>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        onChange={() =>
                                          handleCheckBoxDeleteChange(
                                            index,
                                            subIndex,
                                          )
                                        }
                                        checked={checkedDelete.subIndex?.includes(
                                          subIndex,
                                        )}
                                      />
                                    }
                                    label=""
                                  />
                                  {subIndex + 1}
                                </td>
                                <td>{sub.isoDate?.split("T")[0]}</td>
                                <td>{sub.roomsCount}</td>
                                <td>{sub.note}</td>
                                <td>{sub.createdBy ? sub.createdBy : "-"}</td>
                                <td>{sub.modifiedBy ? sub.modifiedBy : "-"}</td>
                                <td>
                                  <Buttons
                                    onClick={() =>
                                      handleDelete(index, subIndex)
                                    }
                                    label={<MdDeleteOutline />}
                                    className="delete-btn"
                                  />
                                </td>
                              </tr>
                            </>
                          ),
                        )}
                    </>
                  ))}
                </tbody>
              </table>
              {showConfirm && (
                <Confirmation
                  type="delete"
                  confirm={confirmDelete}
                  cancel={() => setShowConfirm(false)}
                  message={`Do You ant To Delete`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
