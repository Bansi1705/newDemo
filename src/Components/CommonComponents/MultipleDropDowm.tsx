import React, { useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import InputField from "./InputFeild";
import { ImCancelCircle } from "react-icons/im";
import Button from "@mui/material/Button";
import { TOASTER } from "../../Services/CommonService/ToasterHelper";
type options = { label: string; value: string };
interface Props {
  options: options[];
  setOption: React.Dispatch<React.SetStateAction<options[]>>;
  placeHolder?: string;
  isAdd?: boolean;
  isDelete?: boolean;
  onSend?: boolean;
}
const CommonMultiSelect: React.FC<Props> = ({
  options,
  setOption,
  placeHolder = "select",
  isAdd,
  isDelete,
  onSend,
}) => {
  const [openDropDown, setOpenDropDown] = useState<boolean>(false);
  const [dropDownData, setDropDownData] = useState<string>("");
  const [selected, setSelected] = useState<options[]>([]);

  const handleSelect = (item: options) => {
    const exists = selected.find((i) => i.value === item.value);
    if (exists) {
      setSelected(selected.filter((i) => i.value !== item.value));
    } else {
      setSelected([...selected, item]);
    }
  };

  const handleAdd = (e: React.KeyboardEvent) => {
    if (e.key == "Enter") {
      if (!dropDownData.trim()) {
        return TOASTER.ERROR.COMMON();
      }
      const newItem = {
        label: dropDownData.toUpperCase(),
        value: dropDownData.toLowerCase(),
      };
      const isAdded = options.find((i) => i.value == newItem.value);
      if (!isAdded) {
        setOption([newItem, ...options]);
      }
      setDropDownData("");
    }
  };
  const handleRemove = (item: options) => {
    setOption(options.filter((i) => i.value !== item.value));
    setSelected(selected.filter((i) => i.value !== item.value));
  };
  const handleSelectAll = (checked: boolean) => {
    return checked ? setSelected(options) : setSelected([]);
  };
  return (
    <div className="relative w-56 text-black">
      <div className="flex items-center justify-between px-3 py-2 border border-gray-300 bg-white cursor-pointer">
        {placeHolder}
        <GoTriangleDown onClick={() => setOpenDropDown(!openDropDown)} />
      </div>
      {openDropDown && (
        <div className="absolute w-full mt-2 max-h-52 overflow-y-auto bg-white border border-gray-300 rounded-lg">
          <div className="p-2">
            {isAdd && (
              <InputField
                type="text"
                onChange={(e) => setDropDownData(e.target.value)}
                name="dropDownData"
                value={dropDownData}
                placeholder="Add Value"
                classname="border border-gray-400"
                onKeyDown={handleAdd}
              />
            )}

            {selected.length > 0 && (
              <>
                <input
                  type="checkbox"
                  checked={selected.length === options.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <label>Select All</label>
              </>
            )}
          </div>
          {options.map((item) => (
            <div className="flex items-center gap-2 px-3 py-2" key={item.value}>
              <label className="flex w-3/4 items-center gap-2 px-3 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.some((i) => i.value === item.value)}
                  onChange={() => handleSelect(item)}
                />
                <span className="text-sm text-gray-700">{item.label}</span>
              </label>
              {isDelete && (
                <div
                  onClick={() => handleRemove(item)}
                  className="cursor-pointer"
                >
                  <ImCancelCircle />
                </div>
              )}
            </div>
          ))}
          {onSend && (
            <div className="p-2 border-t">
              <Button className="w-full">Send</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default CommonMultiSelect;