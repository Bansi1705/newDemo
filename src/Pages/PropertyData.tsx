import { Fragment, useEffect, useState } from "react";
import Header from "../Components/Header";
import "../Styles/PropertyData.css";
import type { ApiResponse } from "../Interface/types";
import { Apiservice } from "../Services/ApiService";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";
import Loader from "../Components/CommonComponents/Loader";
import Toaster from "../Services/CommonService/ToasterHelper";
import { CONSTANT } from "../Services/Constant";

interface DepartmentData {
  categoryName: string;
  departmentTotalBudget: number;
  ab: number;
  ttm: number;
}
interface PropertyDataInterface {
  propertyName: string;
  data: {
    departments: DepartmentData[];
  };
}

const PropertyData: React.FC = () => {
  const [propertyData, setPropertyData] = useState<PropertyDataInterface[]>([]);
  const [loadData, setLoadData] = useState<boolean>(true);

  const propertyColumnHeader = [
    { label: "Budget", key: "departmentTotalBudget" },
    { label: "A+B", key: "ab" },
    { label: "TTM", key: "ttm" },
  ];

  const getCategoryNames = () => {
    const categoryNames: string[] = [];

    propertyData.forEach((property) => {
      property.data.departments.forEach((department) => {
        if (!categoryNames.includes(department.categoryName)) {
          categoryNames.push(department.categoryName);
        }
      });
    });

    return categoryNames;
  };

  const getDepartmentData = (
    property: PropertyDataInterface,
    categoryName: string,
  ) => {
    return property.data.departments.find(
      (department) => department.categoryName === categoryName,
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadData(true);
        const res: ApiResponse<PropertyDataInterface[]> =
          await Apiservice.get("/propertyData");

        const formattedData: PropertyDataInterface[] = res.data.map((item) => {
          const dashboardData = item.data.dashboardData;
          console.log(dashboardData);
          const departments: DepartmentData[] = [];

          Object.keys(dashboardData).forEach((key) => {
            if (
              key !== "categories" &&
              dashboardData[key].categoryName &&
              !dashboardData[key].data
            ) {
              departments.push({
                categoryName: dashboardData[key].categoryName,
                departmentTotalBudget:
                  dashboardData[key].departmentTotalBudget || 0,
                ab: dashboardData[key].ab || 0,
                ttm: dashboardData[key].ttm || 0,
              });
            }
          });

          const categories = dashboardData.categories;

          Object.keys(categories).forEach((key) => {
            categories[key].forEach((row: DepartmentData) => {
              departments.push({
                categoryName: row.categoryName,
                departmentTotalBudget: row.departmentTotalBudget || 0,
                ab: row.ab || 0,
                ttm: row.ttm || 0,
              });
            });
          });

          if (dashboardData.fixedEpenseArray?.data) {
            dashboardData.fixedEpenseArray.data.forEach(
              (row: DepartmentData) => {
                departments.push({
                  categoryName: row.categoryName,
                  departmentTotalBudget: row.departmentTotalBudget || 0,
                  ab: row.ab || 0,
                  ttm: row.ttm || 0,
                });
              },
            );
          }

          if (dashboardData.nonOperatingExpense?.data) {
            dashboardData.nonOperatingExpense.data.forEach(
              (row: DepartmentData) => {
                departments.push({
                  categoryName: row.categoryName,
                  departmentTotalBudget: row.departmentTotalBudget || 0,
                  ab: row.ab || 0,
                  ttm: row.ttm || 0,
                });
              },
            );
          }
          return {
            propertyName: item.propertyName,
            data: {
              departments,
            },
          };
        });

        setPropertyData(formattedData);
      } catch {
        Toaster.error(CONSTANT.TOAST_ERROR_MSG.NOT_FOUND)
      } finally {
        setLoadData(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <>
        <Header />

        <div className="property-data">
          <div className="propertyData-table-section">
            <div className="propertyData-table-wrapper">
              <table border={2} className="property-data-table">
                <thead>
                  <tr>
                    <th rowSpan={2}>Category</th>
                    {propertyData.map((property, index) => (
                      <th key={index} colSpan={propertyColumnHeader.length}>
                        {property.propertyName}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {propertyData.map((property) =>
                      propertyColumnHeader.map((header) => (
                        <th key={`${property.propertyName}-${header.key}`}>
                          {header.label}
                        </th>
                      )),
                    )}
                  </tr>
                </thead>

                <tbody>
                  {getCategoryNames().map((categoryName) => (
                    <tr key={categoryName}>
                      <td className="category-cell">{categoryName}</td>
                      {propertyData.map((property) => {
                        const department = getDepartmentData(
                          property,
                          categoryName,
                        );

                        return (
                          <Fragment key={property.propertyName}>
                            <td>
                              {COMMON_SERVICES.formatValue(
                                department?.categoryName,
                                department?.departmentTotalBudget,
                              )}
                            </td>
                            <td>
                              {COMMON_SERVICES.formatValue(
                                department?.categoryName,
                                department?.ab,
                              )}
                            </td>
                            <td>
                              {COMMON_SERVICES.formatValue(
                                department?.categoryName,
                                department?.ttm,
                              )}
                            </td>
                          </Fragment>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
      {loadData && <Loader />}
    </div>
  );
};
export default PropertyData;
