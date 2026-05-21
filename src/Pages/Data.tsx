import { useEffect, useState } from "react";
import "../Styles/Data.css";
import type { ApiResponse, tableData } from "../Interface/types";
import { Apiservice } from "../Services/ApiService";
import Header from "../Components/Header";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";
import { FaRegCommentDots } from "react-icons/fa";
import Loader from "../Components/CommonComponents/Loader";

function Data() {
  const [data, setData] = useState<tableData[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loadData, setLoadingData] = useState<boolean>(true);

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

  const filteredUsers = data.filter((row) => {
    if (row.isHeader) return true;
    return row.categoryName?.toLowerCase().includes(search.toLowerCase());
  });

  const sortedUsers = () => {
    if (!sortKey) return filteredUsers;
    const onlyRows = filteredUsers.filter((row) => !row.isHeader);
    return COMMON_SERVICES.sortData(onlyRows,sortOrder,sortKey)
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
        setLoadingData(true);
        const response: ApiResponse<tableData[]> =
          await Apiservice.get("/data");
        const rows = Object.values(response.data);

        const filteredRows: tableData[] = rows.filter(
          (item: tableData) => item.categoryName,
        );

        const categoryList = [
          { title: "Source Of Revenue", key: "sourceOfRevenue" },
          { title: "Department Expenses", key: "departmentExpenses" },
          { title: "Department Profit", key: "departmentProfit" },
          { title: "General Expenses", key: "generalExpenses" },
        ];

        const categories = response.data.categories;

        const categoryRows: tableData[] = [];

        categoryList.forEach((cat) => {
          categoryRows.push({ categoryTitle: cat.title, isHeader: true });
          categories[cat.key].forEach((item: tableData) => {
            categoryRows.push(item);
          });
        });

        const allRows: tableData[] = [...filteredRows, ...categoryRows];

        setData(allRows);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchUsers();
  }, []);

  const totalVariables = (name: string) => {
    return (
      name === "Total Occupied Rooms" ||
      name === "Total Room Available" ||
      name === "Total Occupancy %" ||
      name === "Total General Expenses" ||
      name === "Total Department Expense"
    );
  };

  return (
    <div>
      {loadData ? (
        <Loader />
      ) : (
        <>
          <Header search={search} setSearch={setSearch} searchShow={true} />
          <div className="user-data">
            <div className="table-data">
              <div className="table-wrapper">
                <table border={2} className="data-table">
                  <thead>
                    <tr>
                      {tableHeader.map((head, index) => (
                        <th
                          key={index}
                          onClick={() => handleSortClick(head.key)}
                        >
                          <div className="flex items-center gap-1">
                            {head.label}
                            {sortKey === head.key ? (
                              sortOrder === "asc" ? (
                                <FaArrowDown size={15} />
                              ) : (
                                <FaArrowUp size={15} />
                              )
                            ) : (
                              <FaArrowUp />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUsers().map((row: tableData, index: number) => (
                      <tr key={index}>
                        {row.isHeader ? (
                          <td colSpan={8}>{row.categoryTitle}</td>
                        ) : (
                          <>
                            <td
                              style={{
                                fontWeight: totalVariables(row.categoryName)
                                  ? "bold"
                                  : "normal",
                              }}
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
                              {row.commentCount == 0 ? (
                                "-"
                              ) : (
                                <div
                                  style={{
                                    position: "relative",
                                    display: "inline-block",
                                  }}
                                >
                                  <FaRegCommentDots />
                                  <span className="commentIcon">
                                    {row.commentCount}
                                  </span>
                                </div>
                              )}
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
        </>
      )}
    </div>
  );
}

export default Data;
