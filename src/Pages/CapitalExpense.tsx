import Header from "../Components/Header";
import { useEffect, useState } from "react";
import type { ApiResponse } from "../Interface/types";
import { Apiservice } from "../Services/ApiService";
import Loader from "../Components/CommonComponents/Loader";
import "../Styles/CapitalExpense.css";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import Toaster from "../Services/CommonService/ToasterHelper";
import { CONSTANT } from "../Services/Constant";

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
  const [serchCapExTerm, setSerchCapExTerm] = useState<string>("");

  useEffect(() => {
    const fetchCapEx = async () => {
      try {
        const res: ApiResponse<CapEx> = await Apiservice.get("/capitalExpense");
        setCapExData(res.data);
      } catch {
        Toaster.error(CONSTANT.TOAST_ERROR_MSG.NOT_FOUND)
      } finally {
        setLoadCapEx(false);
      }
    };

    fetchCapEx();
  }, []);

  const capExTableHeaders = [
    { key: "srNo", label: "Sr No." },
    { key: "propertyName", label: "Property Name" },
    { key: "projectName", label: "Project Name" },
    { key: "invoiceDate", label: "Expense Date" },
    { key: "postDate", label: "Post Date" },
    { key: "vendorName", label: "Vendor" },
    { key: "invoiceNumber", label: "Invoice Number" },
    { key: "invoiceType", label: "Type" },
    { key: "invoiceAmount", label: "Cost" },
    { key: "description", label: "Description" },
    { key: "approverName", label: "Approver" },
    { key: "approvalStatus", label: "Approval Status" },
    { key: "expenseCommentCount", label: "Comment" },
  ];

  const handleCapExSorting = (key: string) => {
    if (sortKey == key) {
      setSortOrder(sortOrder == "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };
  const formattedCapExData = capExData.content.map((item) => ({
    ...item,
    propertyName: item.property.propertyName,
    projectName: item.project?.projectName,
    vendorName: item.vendor.vendorName,
    approverName: item.approvedByUser?.name || "-",
  }));

  const sortCapExData = COMMON_SERVICES.sortData(
    formattedCapExData,
    sortOrder,
    sortKey,
  );

  const filteredCapEx = sortCapExData.filter(
    (item) =>
      item.propertyName.toLowerCase().includes(serchCapExTerm.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(serchCapExTerm.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(serchCapExTerm.toLowerCase()),
  );

  return (
    <>
      {loadCapEx ? (
        <Loader />
      ) : (
        <>
          <Header
            showSearchInput={true}
            searchTerm={serchCapExTerm}
            setSearchTerm={setSerchCapExTerm}
          />
          <main className="capital-expense-page">
            <section className="capital-expense-section">
              <h2 className="capital-expense-title">Capital Expense</h2>

              <div className="capital-expense-table-wrap">
                <table className="capital-expense-table">
                  <thead>
                    <tr>
                      {capExTableHeaders.map((head) => (
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
                    {filteredCapEx.length === 0 ? (
                      <tr>
                        <td
                          className="capital-expense-empty"
                          colSpan={capExTableHeaders.length}
                        >
                          No Data Found
                        </td>
                      </tr>
                    ) : (
                      filteredCapEx.map((item, index) => {
                        const formatedStatus = COMMON_SERVICES.formatText(
                          item.approvalStatus,
                        );
                        const statusClass = `status-${formatedStatus}`;
                        return (
                          <>
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.propertyName}</td>
                              <td>{item.projectName || "-"}</td>
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
                              <td>{item.vendorName}</td>
                              <td>{item.invoiceNumber}</td>
                              <td>{item.invoiceType}</td>
                              <td>{item.invoiceAmount}</td>
                              <td>{item.description}</td>
                              <td>
                                {item.expenseApprovalPersonList[0]
                                  ?.approvalName || "-"}
                                / <br />
                                {item.approverName || "-"}
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
