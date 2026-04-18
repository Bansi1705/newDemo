import { useEffect, useState } from "react";
import type { ApiResponse, tableData } from "../Interface/types";
import { Apiservice } from "../Services/ApiService";
import Header from "../Components/Header";

function Data() {
  const [data, setData] = useState<tableData[]>([]);
  const [search, setSearch] = useState<string>("");

  const filteredUsers = data.filter((row: any) => {
    if (row.isHeader) return true;
    return row.categoryName?.toLowerCase().includes(search.toLowerCase());
  });

  const header = ["Name", "ActualMTD", "BudgetMTD", "Variance", "CommentCoutn"];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response: ApiResponse = await Apiservice.get("/data");
        const rows = Object.values(response.data);
        const rowsTitle = Object.keys(response.data);
        console.log(rowsTitle);

        const filteredRows = rows.filter(
          (item: any) =>
            item.categoryName &&
            item.actualMTD !== null &&
            item.budgetMTD !== null &&
            item.variance !== null &&
            item.commentCount !== null,
        );

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

          (categories[cat.key] || []).forEach((item: any) => {
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
                  {header.map((head, index) => (
                    <th key={index}>{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((row: any, index: number) => (
                  <tr key={index}>
                    {row.isHeader ? (
                      <td colSpan={5}>{row.categoryTitle}</td>
                    ) : (
                      <>
                        <td>{row.categoryName}</td>
                        <td>{row.actualMTD}</td>
                        <td>{row.budgetMTD}</td>
                        <td>{row.variance}</td>
                        <td>{row.commentCount}</td>
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
