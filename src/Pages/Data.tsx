import { useEffect, useState } from "react";
import type { ApiResponse, tableData } from "../Interface/types";
import { Apiservice } from "../Services/ApiService";
import Header from "../Components/Header";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";
import { FaBell } from "react-icons/fa6";

function Data() {
  const [data, setData] = useState<tableData[]>([]);
  const [search, setSearch] = useState<string>("");

  const [sortKey, setSortKey] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSortClick = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredUsers = data.filter((row: any) => {
    if (row.isHeader) return true;
    return row.categoryName?.toLowerCase().includes(search.toLowerCase());
  });

  const sortedUsers = () => {
    if (!sortKey) return filteredUsers;

    const onlyRows = filteredUsers.filter((row: any) => !row.isHeader);

    return onlyRows.sort((a: any, b: any) => {
      if (sortKey === "categoryName") {
        return sortOrder === "asc"
          ? a.categoryName.localeCompare(b.categoryName)
          : b.categoryName.localeCompare(a.categoryName);
      }

      if (sortOrder === "asc") {
        return a[sortKey] > b[sortKey] ? 1 : -1;
      } else {
        return a[sortKey] < b[sortKey] ? 1 : -1;
      }
    });
  };

  const tableHeader = [
    { label: "Name", key: "categoryName" },
    { label: "ActualMTD", key: "actualMTD" },
    { label: "BudgetMTD", key: "budgetMTD" },
    { label: "Variance", key: "variance" },
    { label: "CommentCoutn", key: "commentCounts" },
    { label: "BudgetMTH", key: "budgetMTH" },
    { label: "VarianceMTH", key: "varianceMTH" },
    { label: "ForecastMTH", key: "forecastMTH" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response: ApiResponse = await Apiservice.get("/data");
        const rows = Object.values(response.data);
        const rowstype = Object.keys(response.data);
        console.log(rowstype);

        const filteredRows = rows.filter((item: any) => item.categoryName);

        const categoryList = [
          { title: "Source Of Revenue", key: "sourceOfRevenue" },
          { title: "Department Expenses", key: "departmentExpenses" },
          { title: "Department Profit", key: "departmentProfit" },
          { title: "General Expenses", key: "generalExpenses" },
        ];

        const categories = response.data.categories;

        const categoryRows: any[] = [];

        categoryList.forEach((cat) => {
          categoryRows.push({ categoryTitle: cat.title, isHeader: true });
          categories[cat.key].forEach((item: any) => {
            categoryRows.push(item);
          });
        });

        const allRows = [...filteredRows, ...categoryRows];

        setData(allRows);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <Header search={search} setSearch={setSearch} searchShow={true} />
      <div className="user-data">
        <div className="table-data">
          <div className="table-wrapper">
            <table border={2} className="data-table">
              <thead>
                <tr>
                  {tableHeader.map((head, index) => (
                    <th key={index} onClick={() => handleSortClick(head.key)}>
                      <div className="flex items-center gap-1">
                        {head.label}
                        {sortKey === head.key &&
                          (sortOrder === "asc" ? (
                            <FaArrowDown />
                          ) : (
                            <FaArrowUp />
                          ))}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedUsers().map((row: any, index: number) => (
                  <tr key={index}>
                    {row.isHeader ? (
                      <td colSpan={8}>{row.categoryTitle}</td>
                    ) : (
                      <>
                        <td
                          
                        >
                          {row.categoryName}
                        </td>
                        <td
                          style={{
                            color: COMMON_SERVICES.getPercentageColor(
                              row.actualMTD,
                              row.budgetMTD,
                            ),
                          }}
                        >
                          {COMMON_SERVICES.formatValue(
                            row.categoryName,
                            row.actualMTD,
                          )}
                        </td>
                        <td>{row.budgetMTD}</td>
                        <td>{row.variance}</td>
                        <td>
                          <div
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <FaBell size={18} />

                            <span
                              style={{
                                position: "absolute",
                                top: "-8px",
                                right: "-10px",
                                background: "red",
                                color: "white",
                                borderRadius: "50%",
                                padding: "2px 6px",
                                fontSize: "10px",
                              }}
                            >
                              {row.commentCount}
                            </span>
                          </div>
                        </td>
                        <td>{row.budgetMTH}</td>
                        <td>{row.varianceMTH}</td>
                        <td>{row.forecastMTH}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Data;
