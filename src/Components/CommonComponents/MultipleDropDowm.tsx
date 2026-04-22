import React, { useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import { Buttons } from "./Buttons";
import InputField from "./InputFeild";

type Props = {
  options: string[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  setOption: React.Dispatch<React.SetStateAction<string[]>>;
  placeHolder?: string;
};

const CommonMultiSelect: React.FC<Props> = ({
  options,
  selected,
  setSelected,
  setOption,
  placeHolder = "select",
}) => {
  const [openDropDown, setOpenDropDown] = useState<boolean>(false);
  const [dropDownData, setDropDownData] = useState<string>("");

  const handleSelect = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const handleAdd = () => {
    if (!dropDownData.trim()) return;

    if (!options.includes(dropDownData)) {
      setOption([...options, dropDownData]);
    }

    setDropDownData(""); // clear input
  };
  console.log(selected);

  return (
    <div className="relative w-56 text-black">
      <div className="flex item-center justify-between px-3 py-2 border border-gray-300 bg-white cursor-pointer">
        {placeHolder}
        <GoTriangleDown onClick={() => setOpenDropDown(!openDropDown)} />
      </div>

      {openDropDown && (
        <div className="absolute w-full mt-2 max-h-52 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-md z-10">
          <div className="flex items-center">
            <InputField
              type="text"
              onChange={(e) => setDropDownData(e.target.value)}
              name="dropDownData"
              value={dropDownData}
            />
            <Buttons type="submit" label="ADD" onClick={handleAdd} />
          </div>
          {options.map((item, index) => (
            <label
              key={index}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(item)}
                onChange={() => handleSelect(item)}
              />
              <span className="text-sm text-gray-700">{item}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommonMultiSelect;
