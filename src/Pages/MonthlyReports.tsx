import { useEffect, useState } from "react";
import { Apiservice } from "../Services/ApiService";
import type { ApiResponse } from "../Interface/types";
import { toast } from "react-toastify";
import { CONSTANT } from "../Services/Constant";
import Loader from "../Components/CommonComponents/Loader";
import Header from "../Components/Header";
import "../Styles/MonthlyReports.css";
import ApprovalMenu from "../Components/CommonComponents/ApprovalMenu";

interface NextApprover {
  status: string;
  approverNames: string[];
}

interface ApprovalUser {
  name: string;
}

interface ApprovalFlow {
  approvalUsers: ApprovalUser[];
  status: string;
}

interface MonthData {
  nextApprover: NextApprover;
  formStatus: string;
  commentCount: number;
  pmFormApprovalWorkflow: ApprovalFlow[];
}

interface Reports {
  [key: string]: MonthData;
}

const MonthlyReports = () => {
  const [monthData, setMonthData] = useState<Reports>({});
  const [loadMonth, setLoadMonth] = useState<boolean>(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res: ApiResponse<Reports> = await Apiservice.get("/reports");
        setMonthData(res.data);
      } catch {
        toast.error(CONSTANT.ERROR.NOT_FOUND);
      } finally {
        setLoadMonth(false);
      }
    };

    fetchReport();
  }, []);

  const MonthTableHeader = [
    { key: "Month", label: "Month" },
    { key: "approverNames", label: "Approver" },
    { key: "formStatus", label: "Form Status" },
    { key: "status", label: "Status" },
    { key: "commentCount", label: "Comment Count" },
  ];

  const formatText = (text?: string) => {
    if (!text) return "-";
    const replacedText = text.toLowerCase().replaceAll("_", " ");
    return replacedText.charAt(0).toUpperCase() + replacedText.slice(1);
  };
  return (
    <>
      {loadMonth ? (
        <Loader />
      ) : (
        <div>
          <Header />

          <main className="monthly-report-page">
            <section className="monthly-report-section">
              <h2 className="monthly-report-title">Monthly Reports</h2>

              <div className="monthly-report-table-wrap">
                <table className="monthly-report-table">
                  <thead>
                    <tr>
                      {MonthTableHeader.map((head) => (
                        <th key={head.key}>{head.label}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {Object.entries(monthData).length > 0 ? (
                      Object.entries(monthData).map(([month, data]) => (
                        <tr key={month}>
                          <td className="monthly-report-month">
                            {formatText(month)}
                          </td>
                          <td>
                            <div className="flex flex-wrap gap-2">
                              {data.pmFormApprovalWorkflow.map((workflow) => {
                                return (
                                  <ApprovalMenu
                                    approverName={data.nextApprover.approverNames}
                                    approvalUsers={workflow.approvalUsers}
                                    status={workflow.status}
                                  />
                                );
                              })}
                            </div>
                          </td>
                          <td>
                            <span className="monthly-report-badge">
                              {formatText(data.formStatus)}
                            </span>
                          </td>
                          <td>
                            <span className="monthly-report-status">
                              {formatText(data.nextApprover?.status)}
                            </span>
                          </td>
                          <td>
                            <span className="commentIcon">
                              {data.commentCount || 0}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="monthly-report-empty">
                          No monthly reports found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      )}
    </>
  );
};

export default MonthlyReports;
