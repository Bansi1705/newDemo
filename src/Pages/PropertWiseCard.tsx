import { useEffect, useState } from "react";
import Header from "../Components/Header";
import "../Styles/PropertyCard.css";
import type { ApiResponse } from "../Interface/types";
import { Apiservice } from "../Services/ApiService";
import { toast } from "react-toastify";
import { CONSTANT } from "../Services/Constant";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ReactDatePicker } from "../Components/CommonComponents/DatePicker";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";
import Loader from "../Components/CommonComponents/Loader";

interface ContentInterface {
  date: string;
  property: {
    propertyName: string;
  };
  time: string;
  temperature: string;
  phLevel: string;
  waterFlowRate: string;
  chlorine: string;
  createdByUser: {
    name: string;
  };
  createdAt: string;
}

interface ListViewInterface {
  content: ContentInterface[];
  totalElements: number;
  totalPages: number;
}

export const PropertyWiseCard = () => {
  const [listProperty, setListProperty] = useState<ListViewInterface | null>(
    null,
  );
  const [loadProperty,setLoadProperty]=useState<boolean>(true)
  const [selectedTime, setSelectedTime] = useState<string>("All");
  const [selectProperty, setSelectProperty] = useState<string>("");
  const [selectDate, setSelectDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchListData = async () => {
      try {
        setLoadProperty(true)
        const listResponse: ApiResponse<ListViewInterface> =
          await Apiservice.get("/propertyWiseReadings");

        setListProperty(listResponse.data);
      } catch (error) {
        console.log(error);
        toast.error(CONSTANT.ERROR.COMMON);
      }finally{
        setLoadProperty(false)
      }
    };

    fetchListData();
  }, []);

  const groupedData: Record<string, Record<string, ContentInterface[]>> = {};

  if (listProperty?.content) {
    for (const item of listProperty.content) {
      const propertyName = item.property.propertyName;
      const date = item.date;

      if (!groupedData[propertyName]) {
        groupedData[propertyName] = {};
      }

      if (!groupedData[propertyName][date]) {
        groupedData[propertyName][date] = [];
      }

      groupedData[propertyName][date].push(item);
    }
  }

  const filterCardsByTime = (cards: ContentInterface[]) => {
    if (selectedTime === "All Time") {
      return cards;
    }

    return cards.filter((card) => {
      const hour = Number(card.time.split(":")[0]);

      if (selectedTime === "8") {
        return hour === 8;
      }

      if (selectedTime === "2") {
        return hour === 2;
      }

      if (selectedTime === "10") {
        return hour === 10;
      }

      return true;
    });
  };

  const timeOptions = [
    { label: "All Time", value: "All Time" },
    { label: "8 AM", value: "8" },
    { label: "2 PM", value: "2" },
    { label: "10 PM", value: "10" },
  ];

  const propertyNames: string[] = [];

  listProperty?.content.forEach((item) => {
    if (!propertyNames.includes(item.property.propertyName)) {
      propertyNames.push(item.property.propertyName);
    }
  });

  const hasData = () => {
    return Object.entries(groupedData).find(([propertyName, dates]) => {
      if (selectProperty && selectProperty !== propertyName) {
        return false;
      }

      return Object.entries(dates).find(([date, cards]) => {
        if (
          selectDate &&
          new Date(date).toDateString() !== selectDate.toDateString()
        ) {
          return false;
        }

        return filterCardsByTime(cards).length > 0;
      });
    });
  };

  return (
    <div>
      {loadProperty? <Loader/>:(<>
       <Header />

      <div className="propertyCard">
        <div className="selection relative inline-block">
          <div className="absolute right-75 w-1/4">
            <ReactDatePicker
              selectedDate={selectDate}
              onChange={(date) => setSelectDate(date)}
              placeholder="Select Date"
            />
          </div>

          <div className="selectProperty w-1/4">
            <Menu as="div" className="absolute right-35">
              <MenuButton className="bg-blue-500 px-3 py-2 rounded cursor-pointer text-white min-w-[160px] break-words whitespace-normal text-left">
                {propertyNames.find((i) => i === selectProperty) || "All Property"}
              </MenuButton>

              <MenuItems className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => setSelectProperty("")}
                      className={`block w-full text-left px-4 py-2 ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      All
                    </button>
                  )}
                </MenuItem>

                {propertyNames.map((option, i) => (
                  <MenuItem key={i}>
                    {({ active }) => (
                      <button
                        onClick={() => setSelectProperty(option)}
                        className={`block w-full text-left px-4 py-2 ${
                          active ? "bg-gray-100" : ""
                        }`}
                      >
                        {option}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>

          <div className="selectTime w-1/4">
            <Menu as="div" className="absolute right-0">
              <MenuButton className="bg-blue-500 px-3 py-2 rounded cursor-pointer text-white min-w-[100px] truncate">
                {timeOptions.find((i) => i.value === selectedTime)?.label ||
                  timeOptions[0].label}
              </MenuButton>

              <MenuItems className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                {timeOptions.map((option) => (
                  <MenuItem key={option.value}>
                    {({ active }) => (
                      <button
                        onClick={() => setSelectedTime(option.value)}
                        className={`block w-full text-left px-4 py-2 ${
                          active ? "bg-gray-100" : ""
                        }`}
                      >
                        {option.label}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>

        {!hasData() && (
          <div className="text-center mt-10 text-xl font-semibold">
            No Data Found
          </div>
        )}

        {Object.entries(groupedData).map(
          ([propertyName, dates], propertyIndex: number) => {
            if (selectProperty && selectProperty !== propertyName) {
              return null;
            }

            return (
              <section className="property-group" key={propertyIndex}>
                <h2 className="property-group__title">{propertyName}</h2>

                {Object.entries(dates).map(
                  ([date, cards], dateIndex: number) => {
                    if (
                      selectDate &&
                      new Date(date).toDateString() !==
                        selectDate.toDateString()
                    ) {
                      return null;
                    }
                    const filterCards = filterCardsByTime(cards);

                    if (filterCards.length === 0) return null;

                    return (
                      <div className="property-date-group" key={dateIndex}>
                        <h3 className="property-date-group__title">{date}</h3>

                        <div className="property-date-cards">
                          {filterCards.map((card, cardIndex: number) => (
                            <div className="property-data-card" key={cardIndex}>
                              <div className="property-data-card__header">
                                <span>{card.time}</span>

                                <strong>
                                  {card.createdByUser?.name ?? "-"}
                                </strong>
                              </div>

                              <div className="property-data-card__stats">
                                <p>
                                  <span>Temperature</span>
                                  <strong>{card.temperature ?? 0}</strong>
                                </p>

                                <p>
                                  <span>PH Level</span>
                                  <strong>{card.phLevel ?? 0}</strong>
                                </p>

                                <p>
                                  <span>Water Flow</span>
                                  <strong>{card.waterFlowRate ?? 0}</strong>
                                </p>

                                <p>
                                  <span>Chlorine</span>
                                  <strong>{card.chlorine ?? 0}</strong>
                                </p>
                              </div>

                              <p className="property-data-card__date">
                                Created :{COMMON_SERVICES.formatCreateDate(card.createdAt)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  },
                )}
              </section>
            );
          },
        )}
      </div>
      </>)}
     
    </div>
  );
};
