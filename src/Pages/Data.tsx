import { useEffect, useState } from "react";
import "../Styles/Data.css";
import type { ApiResponse, tableData } from "../Interface/types";
import { Apiservice } from "../Services/ApiService";
import Header from "../Components/Header";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";
import { FaRegCommentDots } from "react-icons/fa";
import Loader from "../Components/CommonComponents/Loader";
import ExcelJS from "exceljs";
import { ExcelDownload } from "../Services/CommonService/ExcelDownload";

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
    return COMMON_SERVICES.sortData(onlyRows, sortOrder, sortKey);
  };

  const dataListTableHeader = [
    { header: "Name", key: "categoryName" },
    { header: "ActualMTD", key: "actualMTD" },
    { header: "BudgetMTD", key: "budgetMTD" },
    { header: "Variance", key: "variance" },
    { header: "CommentCount", key: "commentCounts" },
    { header: "BudgetMTH", key: "budgetMTH" },
    { header: "VarianceMTH", key: "varianceMTH" },
    { header: "ForecastMTH", key: "forecastMTH" },
  ];

  const downloadDataListExcel = async () => {
    const workBook = new ExcelJS.Workbook();
    const worksheets = workBook.addWorksheet("Data File Excel");

    worksheets.columns = dataListTableHeader.map((i) => ({
      header: i.header,
      key: i.key,
    }));

    sortedUsers().forEach((row) => {
      if (row.isHeader) {
        worksheets.addRow([row.categoryTitle]);
      } else {
        worksheets.addRow({
          categoryName: row.categoryName,
          actualMTD: row.actualMTD,
          budgetMTD: row.budgetMTD,
          variance: row.variance,
          commentCount: row.commentCount,
          budgetMTH: row.budgetMTH,
          varianceMTH: row.varianceMTH,
          forecastMTH: row.forecastMTH,
        });
      }
    });

    await ExcelDownload({
      workBook,
      fileName: "Data_Report.xlsx",
    });
  };

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
          <Header
            searchTerm={search}
            setSearchTerm={setSearch}
            showSearchInput={true}
          />
          <div className="user-data">
            <div className="table-data">
              <div className="table-wrapper">
                <button
                  onClick={downloadDataListExcel}
                  className="bg-blue-500 px-3 py-2 mb-2 rounded cursor-pointer"
                >
                  Export Data
                </button>
                <table border={2} className="data-table">
                  <thead>
                    <tr>
                      {dataListTableHeader.map((head, index) => (
                        <th
                          key={index}
                          onClick={() => handleSortClick(head.key)}
                        >
                          <div className="flex items-center gap-1">
                            {head.header}
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
