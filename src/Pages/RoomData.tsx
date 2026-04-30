import { useEffect, useState } from "react";
import Header from "../Components/Header";
import "../Styles/RoomData.css";
import type { ApiResponse, RoomDataInterface } from "../Interface/types";
import { Apiservice } from "../Services/ApiService";
import { toast } from "react-toastify";
import { CONSTANT } from "../Services/Constant";
import { FaPlus } from "react-icons/fa";
import { FaArrowDown, FaArrowUp, FaMinus } from "react-icons/fa6";
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
    subIndex: { parentIndex: number; subIndex: number }[];
  }>({
    index: [],
    subIndex: [],
  });

  const [confirmMsg, setConfirmMsg] = useState<string>("");

  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortKey, setSortKey] = useState<string>("");

  const tableHeader = [
    { label: "Sr NO.", key: "srNo" },
    { label: "Created Date", key: "isoDate" },
    { label: "Room Counts", key: "roomsCount" },
    { label: "Description", key: "description" },
    { label: "Created By", key: "createdBy" },
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

    const room = roomData[index];

    if (subIndex !== undefined) {
      const subRoom = room.subArray[subIndex];
      setConfirmMsg(
        `Do you really want to delete sub room count ${subRoom.roomsCount}?`,
      );
    } else {
      setConfirmMsg(
        `Do you really want to delete the room count ${room.roomsCount}?`,
      );
    }

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
          (_, subIndex) =>
            !checkedDelete.subIndex.find(
              (item) =>
                item.parentIndex === roomData.indexOf(room) &&
                item.subIndex === subIndex,
            ),
        ),
      }));

      setCheckedDelete({
        index: [],
        subIndex: [],
      });
    }

    setRoomsData(newData);
    setShowConfirm(false);
    setConfirmMsg("");
  };

  const handleCheckBoxDeleteChange = (index: number, subIndex?: number) => {
    if (subIndex !== undefined) {
      setCheckedDelete((prev) => {
        const isChecked = prev.subIndex.find(
          (item) => item.parentIndex === index && item.subIndex === subIndex,
        );

        return {
          ...prev,
          subIndex: isChecked
            ? prev.subIndex.filter(
                (item) =>
                  !(item.parentIndex === index && item.subIndex === subIndex),
              )
            : [...prev.subIndex, { parentIndex: index, subIndex }],
        };
      });
    } else {
      setCheckedDelete((prev) => {
        const isParentChecked = prev.index.includes(index);

        return {
          index: isParentChecked
            ? prev.index.filter((item) => item !== index)
            : [...prev.index, index],

          subIndex: isParentChecked
            ? prev.subIndex.filter((item) => item.parentIndex !== index)
            : [
                ...prev.subIndex,
                ...roomData[index].subArray.map((_, subIndex) => ({
                  parentIndex: index,
                  subIndex,
                })),
              ],
        };
      });
    }
  };

  const handleCheckedDelete = () => {
    const roomCounts = checkedDelete.index.map(
      (index) => roomData[index].roomsCount,
    );

    const subRoomCounts = checkedDelete.subIndex.map(
      (item) => roomData[item.parentIndex].subArray[item.subIndex].roomsCount,
    );

    const allRoomCounts = [...roomCounts, ...subRoomCounts];

    setConfirmMsg(
      `Do you really want to delete selected room count ${allRoomCounts.join(", ")}?`,
    );

    setShowConfirm(true);
  };

  const handleSorting = (key: string) => {
    if (key === "srNo" || key === "actions") return;

    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortData = () => {
    if (!sortKey) return roomData;

    return [...roomData].sort((a, b) => {
      const valueA = a[sortKey as keyof RoomDataInterface];
      const valueB = b[sortKey as keyof RoomDataInterface];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });
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
                          {head.label !== "Actions" &&
                            head.label !== "Sr NO." && (
                              <div onClick={() => handleSorting(head.key)}>
                                {sortKey === head.key ? (
                                  sortOrder === "asc" ? (
                                    <FaArrowDown size={15} />
                                  ) : (
                                    <FaArrowUp size={15} />
                                  )
                                ) : (
                                  <FaArrowUp size={15} />
                                )}
                              </div>
                            )}
                          {head.label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortData().map((data: RoomDataInterface, index: number) => (
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
                                        checked={checkedDelete.subIndex.some(
                                          (item) =>
                                            item.parentIndex === index &&
                                            item.subIndex === subIndex,
                                        )}
                                      />
                                    }
                                    label=""
                                  />
                                  {index + 1}.{subIndex + 1}
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
                  message={confirmMsg}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
