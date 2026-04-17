import { useEffect, useState } from "react";
import type { ApiResponse, tableData } from "../Interface/types";
import { Apiservice } from "../Services/ApiService";
import Header from "../Components/Header";

function Data() {
  const [data, setData] = useState<tableData[]>([]);

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

        const categories = response.data.categories;
        const categoryRows = [
          ...categories.sourceOfRevenue,
          ...categories.departmentExpenses,
          ...categories.departmentProfit,
          ...categories.generalExpenses,
        ];
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
      <Header />
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
                {data.map((user, index) => (
                  <tr key={index}>
                    <td>{user.categoryName}</td>
                    <td>{user.actualMTD}</td>
                    <td>{user.budgetMTD}</td>
                    <td>{user.commentCount}</td>
                    <td>{user.variance}</td>
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
