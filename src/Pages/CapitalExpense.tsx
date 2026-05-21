import Header from "../Components/Header";
import { useEffect, useState } from "react";
import type { ApiResponse } from "../Interface/types";
import { Apiservice } from "../Services/ApiService";
import { toast } from "react-toastify";
import { CONSTANT } from "../Services/Constant";
import Loader from "../Components/CommonComponents/Loader";
import { format } from "date-fns";
import "../Styles/CapitalExpense.css";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

interface ApprovalPersonList {
  approvalName: string[];
}
interface Content {
  description: string;
  invoiceNumber: string;
  property: {
    propertyName: string;
  };
  postDate: string;
  invoiceDate: string;
  invoiceType: string;
  project: {
    projectName: string;
  } | null;
  vendor: {
    vendorName: string;
  };
  invoiceAmount: number;
  approvalStatus: string;
  expenseCommentCount: string;
  approvedByUser: {
    name: string;
  } | null;
  expenseApprovalPersonList: ApprovalPersonList[];
}

interface CapEx {
  content: Content[];
}

const CapitalExpense = () => {
  const [capExData, setCapExData] = useState<CapEx>({
    content: [],
  });
  const [loadCapEx, setLoadCapEx] = useState<boolean>(true);
  const [sortKey, setSortKey] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchCapEx = async () => {
      try {
        const res: ApiResponse<CapEx> = await Apiservice.get("/capitalExpense");
        setCapExData(res.data);
      } catch {
        toast.error(CONSTANT.ERROR.NOT_FOUND);
      } finally {
        setLoadCapEx(false);
      }
    };

    fetchCapEx();
  }, []);

  const tableHeaders = [
    { key: "srNo", label: "Sr No." },
    { key: "propertyName", label: "Property Name" },
    { key: "projectName", label: "Project Name" },
    { key: "invoiceDate", label: "Expense Date" },
    { key: "postDate", label: "Post Date" },
    { key: "vendor", label: "Vendor" },
    { key: "invoiceNumber", label: "Invoice Number" },
    { key: "invoiceType", label: "Type" },
    { key: "invoiceAmount", label: "Cost" },
    { key: "description", label: "Description" },
    { key: "approver", label: "Approver" },
    { key: "approvalStatus", label: "Approval Status" },
    { key: "comment", label: "Comment" },
  ];

  const handleCapExSorting = (key: string) => {
    if (sortKey == key) {
      setSortOrder(sortOrder == "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortCapExData = () => {
    return [...capExData.content].sort((a, b) => {
      const valueA =
        sortKey === "propertyName"
          ? a.property.propertyName
          : sortKey === "vendor"
            ? a.vendor.vendorName
            : sortKey === "approver"
              ? a.approvedByUser?.name || ""
              : a[sortKey as keyof Content];

      const valueB =
        sortKey === "propertyName"
          ? b.property.propertyName
          : sortKey === "vendor"
            ? b.vendor.vendorName
            : sortKey === "approver"
              ? b.approvedByUser?.name || ""
              : b[sortKey as keyof Content];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });
  };

  return (
    <>
      {loadCapEx ? (
        <Loader />
      ) : (
        <>
          <Header />
          <main className="capital-expense-page">
            <section className="capital-expense-section">
              <h2 className="capital-expense-title">Capital Expense</h2>

              <div className="capital-expense-table-wrap">
                <table className="capital-expense-table">
                  <thead>
                    <tr>
                      {tableHeaders.map((head) => (
                        <th key={head.key}>
                          <div className="flex items-center gap-1">
                            {head.label !== "Sr No." && (
                              <div onClick={() => handleCapExSorting(head.key)}>
                                {sortKey === head.key ? (
                                  sortOrder === "asc" ? (
                                    <FaArrowDown size={15} />
                                  ) : (
                                    <FaArrowUp size={15} />
                                  )
                                ) : (
                                  <FaArrowUp size={15} />
                                )}
                              </div>
                            )}
                            {head.label}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {capExData.content.length === 0 ? (
                      <tr>
                        <td
                          className="capital-expense-empty"
                          colSpan={tableHeaders.length}
                        >
                          No Data Found
                        </td>
                      </tr>
                    ) : (
                      sortCapExData().map((item, index) => {
                        const formatedStatus = COMMON_SERVICES.formatText(
                          item.approvalStatus,
                        );
                        const statusClass = `status-${formatedStatus}`;
                        return (
                          <>
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.property.propertyName}</td>
                              <td>{item.project?.projectName || "-"}</td>
                              <td>
                                {COMMON_SERVICES.formatCreateDate(
                                  item.invoiceDate,
                                )}
                              </td>
                              <td>
                                {COMMON_SERVICES.formatCreateDate(
                                  item.postDate,
                                )}
                              </td>
                              <td>{item.vendor.vendorName}</td>
                              <td>{item.invoiceNumber}</td>
                              <td>{item.invoiceType}</td>
                              <td>{item.invoiceAmount}</td>
                              <td>{item.description}</td>
                              <td>
                                {item.expenseApprovalPersonList[0]
                                  ?.approvalName || "-"}
                                / <br />
                                {item.approvedByUser?.name || "-"}
                              </td>
                              <td className={`${statusClass}`}>
                                {COMMON_SERVICES.formatText(
                                  item.approvalStatus,
                                )}
                              </td>
                              <td>{item.expenseCommentCount || "-"}</td>
                            </tr>
                          </>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </>
      )}
    </>
  );
};

export default CapitalExpense;
