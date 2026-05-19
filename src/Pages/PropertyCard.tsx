import { useEffect, useState } from "react";
import Header from "../Components/Header";
import "../Styles/PropertyCard.css";
import type { ApiResponse } from "../Interface/types";
import { Apiservice } from "../Services/ApiService";
import { toast } from "react-toastify";
import { CONSTANT } from "../Services/Constant";
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

export const PropertyCard = () => {
  const [listProperty, setListProperty] = useState<ListViewInterface | null>(
    null,
  );
  const [loadPropertData,setLoadPropertyData]=useState<boolean>(true)
  useEffect(() => {
    const fetchListData = async () => {
      try {
        setLoadPropertyData(true)
        const listResponse: ApiResponse<ListViewInterface> =
          await Apiservice.get("/listViewData");

        setListProperty(listResponse.data);
      } catch (error) {
        console.log(error);
        toast.error(CONSTANT.ERROR.COMMON);
      }
      finally{
        setLoadPropertyData(false)
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

  console.log(groupedData);
  return (
    <div>
      {loadPropertData ? <Loader/> : (<> <Header />
      <div>
        <div className="propertyCard">
          {Object.entries(groupedData).map(
            ([propertyName, dates], propertyIndex: number) => (
              <section className="property-group" key={propertyIndex}>
                <h2 className="property-group__title">{propertyName}</h2>

                {Object.entries(dates).map(
                  ([date, cards], dateIndex: number) => (
                    <div className="property-date-group" key={dateIndex}>
                      <h3 className="property-date-group__title">{date}</h3>

                      <div className="property-date-cards">
                        {cards.map((card, cardIndex: number) => (
                          <div className="property-data-card" key={cardIndex}>
                            <div className="property-data-card__header">
                              <span>{card.time}</span>
                              <strong>
                                {card.createdByUser?.name ?? "No User"}
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
                              Created: {card.createdAt?.split("T")[0]}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </section>
            ),
          )}
        </div>
      </div>
      </>)}
     
    </div>
  );
};
