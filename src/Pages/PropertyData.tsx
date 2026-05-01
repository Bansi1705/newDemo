import { Fragment, useEffect, useState } from "react";
import Header from "../Components/Header";
import "../Styles/PropertyData.css";
import type { ApiResponse } from "../Interface/types";
import { Apiservice } from "../Services/ApiService";
import { toast } from "react-toastify";
import { CONSTANT } from "../Services/Constant";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";

interface DepartmentData {
  categoryName: string;
  departmentTotalBudget: number;
  ab: number;
  ttm: number;
}

interface PropertyDataInterface {
  propertyName: string;
  departments: DepartmentData[];
}

export const PropertyData: React.FC = () => {
  const [propertyData, setPropertyData] = useState<PropertyDataInterface[]>([]);

  const propertyColumnHeader = [
    { label: "Budget", key: "departmentTotalBudget" },
    { label: "A+B", key: "ab" },
    { label: "TTM", key: "ttm" },
  ];

  const getCategoryNames = () => {
    const categoryNames: string[] = [];

    propertyData.forEach((property) => {
      property.departments.forEach((department) => {
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
    return property.departments.find(
      (department) => department.categoryName === categoryName,
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: ApiResponse<any[]> = await Apiservice.get("/propertyData");

        const formattedData: PropertyDataInterface[] = res.data.map((item) => {
          const dashboardData = item.data.dashboardData;
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
            categories[key].forEach((row: any) => {
              departments.push({
                categoryName: row.categoryName,
                departmentTotalBudget: row.departmentTotalBudget || 0,
                ab: row.ab || 0,
                ttm: row.ttm || 0,
              });
            });
          });

          if (dashboardData.fixedEpenseArray?.data) {
            dashboardData.fixedEpenseArray.data.forEach((row: any) => {
              departments.push({
                categoryName: row.categoryName,
                departmentTotalBudget: row.departmentTotalBudget || 0,
                ab: row.ab || 0,
                ttm: row.ttm || 0,
              });
            });
          }

          if (dashboardData.nonOperatingExpense?.data) {
            dashboardData.nonOperatingExpense.data.forEach((row: any) => {
              departments.push({
                categoryName: row.categoryName,
                departmentTotalBudget: row.departmentTotalBudget || 0,
                ab: row.ab || 0,
                ttm: row.ttm || 0,
              });
            });
          }
          return {
            propertyName: item.propertyName,
            departments,
          };
        });

        setPropertyData(formattedData);
      } catch {
        toast.error(CONSTANT.ERROR.NOT_FOUND);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Header />

      <div className="user-data">
        <div className="table-data">
          <div className="table-wrapper">
            <table border={2} className="data-table">
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
                    <td>{categoryName}</td>
                    {propertyData.map((property) => {
                      const department = getDepartmentData(
                        property,
                        categoryName,
                      );

                      return (
                        <Fragment key={property.propertyName}>
                          <td>
                            {COMMON_SERVICES.formatropertyPValue(
                              department?.departmentTotalBudget,
                            )}
                          </td>
                          <td>
                            {COMMON_SERVICES.formatropertyPValue(
                              department?.ab,
                            )}
                          </td>
                          <td>
                            {COMMON_SERVICES.formatropertyPValue(
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
    </div>
  );
};
