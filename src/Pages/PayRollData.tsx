import React from "react";
import { useEffect, useState } from "react";
import { Apiservice } from "../Services/ApiService";
import type { ApiResponse } from "../Interface/types";
import Toaster from "../Services/CommonService/ToasterHelper";
import { CONSTANT } from "../Services/Constant";
import Header from "../Components/Header";
import Loader from "../Components/CommonComponents/Loader";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";
import { FaArrowDown, FaArrowUp, FaMinus, FaPlus } from "react-icons/fa6";

interface payRollExpense {
  accountNumber: string;
  departmentType: string;
  categoryName: string;
  actualMTD: number;
  budgetMTD: number;
  variance: number;
  forecastMTH: number;
  budgetMTH: number;
  varianceMTH: number;
  commentCount: number;
  subAccounts?: payRollExpense[];
}

interface payRollInterFace {
  data: Record<string, payRollExpense[]>;
}

const PayRollData: React.FC = () => {
  const [PayRollData, setPayRollData] = useState<payRollInterFace>({
    data: {},
  });
  const [loadPayRollData, setLoadPayROllData] = useState<boolean>(false);
  const [payRollDataSortOrder, setPayRollDataSortOrder] = useState<
    "asc" | "desc"
  >("asc");
  const [sortByPayRollDataKey, setSortByPayRollDataKey] = useState<string>("");
  const [showPayRollSubAccount, setShowPayRollSubAccount] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchPayRoll = async () => {
      try {
        setLoadPayROllData(true);
        const payRollRes: ApiResponse<payRollInterFace> =
          await Apiservice.get("/PayrollData");
        setPayRollData(payRollRes.data);
      } catch {
        Toaster.error(CONSTANT.TOAST_ERROR_MSG.NOT_FOUND);
      } finally {
        setTimeout(() => {
          setLoadPayROllData(false);
        }, 2000);
      }
    };
    fetchPayRoll();
  }, []);

  const payRollTableHeader = [
    { key: "srNo", header: "Sr No" },
    { key: "categoryName", header: "Category Name" },
    { key: "accountNumber", header: "Account Number" },
    { key: "departmentType", header: "Department Type" },
    { key: "actualMTD", header: "ActualMTD" },
    { key: "budgetMTD", header: "BudgetMTD" },
    { key: "variance", header: "Varience" },
    { key: "forecastMTH", header: "ForcastNTH" },
    { key: "budgetMTH", header: "BudgetMTh" },
    { key: "varianceMTH", header: "VarienceMTH" },
    { key: "commentCount", header: "CommentCount" },
  ];

  console.log(Object.keys(PayRollData.data));
  console.log(Object.values(PayRollData.data));

  const TotalOFPayRollsExpense = (name: string) => {
    return (
      name === "Total Payroll & Related Expense (R & M Department)" ||
      name == "Total Payroll Taxes & Other Benefits (R & M Department)" ||
      name == "Total R&M Expense"
    );
  };

  const handlePayrollDataSort = (key: string) => {
    if (key === sortByPayRollDataKey) {
      setPayRollDataSortOrder(payRollDataSortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortByPayRollDataKey(key);
      setPayRollDataSortOrder("asc");
    }
  };

  const sortedPayRollData = (): Record<string, payRollExpense[]> => {
    if (!sortByPayRollDataKey) {
      return PayRollData.data;
    }

    const allData = Object.values(PayRollData.data).flat();

    const sortedItems = COMMON_SERVICES.sortData(
      [...allData],
      payRollDataSortOrder,
      sortByPayRollDataKey,
    );

    return {
      Data: sortedItems,
    };
  };
  console.log(sortedPayRollData());

  return (
    <div className="payRollPage">
      <Header />
      {loadPayRollData && <Loader />}
      <div className="payRollPage-table-div w-[95vw] mx-auto overflow-x-auto bg-white p-4 text-sm">
        <table className="payRollTable min-w-[1200px]">
          <thead>
            <tr className="bg-blue-400 text-white p-4">
              {payRollTableHeader.map((i) => (
                <th key={i.key} className="p-4">
                  <div className="flex items-center gap-1">
                    {i.header !== "Sr No" && (
                      <div
                        className="cursor-pointer"
                        onClick={() => handlePayrollDataSort(i.key)}
                      >
                        {sortByPayRollDataKey === i.key ? (
                          payRollDataSortOrder === "asc" ? (
                            <FaArrowDown size={15} />
                          ) : (
                            <FaArrowUp size={15} />
                          )
                        ) : (
                          <FaArrowUp size={15} />
                        )}
                      </div>
                    )}
                    {i.header}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(() => {
              let srNo = 1;
              const isSorted = !!sortByPayRollDataKey;

              return Object.entries(sortedPayRollData()).map(
                ([name, expence]) => (
                  <React.Fragment key={name}>
                    {!isSorted && (
                      <tr className="text-center">
                        <td colSpan={payRollTableHeader.length} className="p-2">
                          {name}
                        </td>
                      </tr>
                    )}

                    {expence.map((item, index) => (
                      <React.Fragment key={`${item.categoryName}-${index}`}>
                        <tr className="text-center">
                          {item.subAccounts?.length ? (
                            <td>
                              <div className="flex justify-center items-center gap-2">
                                <span
                                  className="cursor-pointer"
                                  onClick={() =>
                                    setShowPayRollSubAccount(
                                      !showPayRollSubAccount,
                                    )
                                  }
                                >
                                  {showPayRollSubAccount ? (
                                    <FaMinus className="text-base font-bold scale-110" />
                                  ) : (
                                    <FaPlus className="text-base font-bold scale-110" />
                                  )}
                                </span>

                                {srNo++}
                              </div>
                            </td>
                          ) : (
                            <td>{srNo++}</td>
                          )}

                          <td
                            className={`p-4 ${
                              TotalOFPayRollsExpense(item.categoryName)
                                ? "font-bold"
                                : "font-normal"
                            }`}
                          >
                            {item.categoryName}
                          </td>

                          <td>{item.accountNumber ?? "-"}</td>

                          <td>
                            {item.departmentType
                              ? COMMON_SERVICES.formatText(item.departmentType)
                              : "-"}
                          </td>

                          <td>{item.actualMTD}</td>
                          <td>{item.budgetMTD}</td>
                          <td>{item.variance}</td>
                          <td>{item.forecastMTH}</td>
                          <td>{item.budgetMTH}</td>
                          <td>{item.varianceMTH}</td>

                          <td>
                            {item.commentCount === 0 ? "-" : item.commentCount}
                          </td>
                        </tr>

                        {showPayRollSubAccount &&
                          item.subAccounts?.map((sub, subIndex) => (
                            <tr
                              key={`${item.categoryName}-sub-${subIndex}`}
                              className="text-center text-pink-300"
                            >
                              <td>
                                {srNo - 1}.{subIndex + 1}
                              </td>

                              <td
                                className={`p-4 ${
                                  TotalOFPayRollsExpense(sub.categoryName)
                                    ? "font-bold"
                                    : "font-normal"
                                }`}
                              >
                                {sub.categoryName}
                              </td>

                              <td>{sub.accountNumber ?? "-"}</td>

                              <td>
                                {sub.departmentType
                                  ? COMMON_SERVICES.formatText(
                                      sub.departmentType,
                                    )
                                  : "-"}
                              </td>

                              <td>{sub.actualMTD}</td>
                              <td>{sub.budgetMTD}</td>
                              <td>{sub.variance}</td>
                              <td>{sub.forecastMTH}</td>
                              <td>{sub.budgetMTH}</td>
                              <td>{sub.varianceMTH}</td>

                              <td>
                                {sub.commentCount === 0
                                  ? "-"
                                  : sub.commentCount}
                              </td>
                            </tr>
                          ))}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ),
              );
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayRollData;
