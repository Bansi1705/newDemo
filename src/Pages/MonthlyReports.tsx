import { useEffect, useState } from "react";
import { Apiservice } from "../Services/ApiService";
import type { ApiResponse } from "../Interface/types";
import Loader from "../Components/CommonComponents/Loader";
import Header from "../Components/Header";
import "../Styles/MonthlyReports.css";
import ApprovalMenu from "../Components/CommonComponents/ApprovalMenu";
import { COMMON_SERVICES } from "../Services/CommonService/CommonServices";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa6";
import { TOASTER } from "../Services/CommonService/ToasterHelper";

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
  const [formStatusFilter, setFormStatusFilter] =
    useState<string>("All Form Status");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res: ApiResponse<Reports> = await Apiservice.get("/reports");
        setMonthData(res.data);
      } catch {
        TOASTER.ERROR.NOT_FOUND();
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

  const filteredFormStatsus: string[] = [];

  Object.entries(monthData).forEach(([_, data]) => {
    if (
      !filteredFormStatsus.includes(COMMON_SERVICES.formatText(data.formStatus))
    ) {
      filteredFormStatsus.push(COMMON_SERVICES.formatText(data.formStatus));
    }
    return null;
  });

  const filteredStatusOptions: string[] = [];

  Object.entries(monthData).forEach(([_, data]) => {
    const status = COMMON_SERVICES.formatText(data.nextApprover?.status || "-");

    if (status !== "-" && !filteredStatusOptions.includes(status)) {
      filteredStatusOptions.push(status);
    }
  });

  const hasReportData = () => {
    return Object.entries(monthData).find(([_, data]) => {
      const formattedStatus = COMMON_SERVICES.formatText(data.formStatus);
      if (
        formStatusFilter &&
        formStatusFilter !== "All Form Status" &&
        formStatusFilter !== formattedStatus
      ) {
        return false;
      }

      if (
        statusFilter &&
        statusFilter !== "All Status" &&
        statusFilter !== COMMON_SERVICES.formatText(data.nextApprover?.status)
      ) {
        return false;
      }
      return true;
    });
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
              <div className="report-header flex item-center justify-between mb-6">
                <h2 className="monthly-report-title">Monthly Reports</h2>

                <div className="report-status-filter">
                  <div className="form-status-filter">
                    <Menu as="div" className="menu-container">
                      <MenuButton className="menu-button flex items-center gap-8">
                        {formStatusFilter}

                        <FaChevronDown size={14} />
                      </MenuButton>

                      <MenuItems className="menu-items">
                        <MenuItem>
                          <button
                            onClick={() =>
                              setFormStatusFilter("All Form Status")
                            }
                            className="block w-full text-left px-4 py-2"
                          >
                            All Form Status
                          </button>
                        </MenuItem>
                        {filteredFormStatsus.map((status) => (
                          <MenuItem key={status}>
                            <button
                              className="menu-item"
                              onClick={() => setFormStatusFilter(status)}
                            >
                              {status}
                            </button>
                          </MenuItem>
                        ))}
                      </MenuItems>
                    </Menu>
                  </div>

                  <div className="status-filter">
                    <Menu as="div" className="status-menu-container">
                      <MenuButton className="status-menu-button flex items-center gap-16">
                        {statusFilter}

                        <FaChevronDown size={14} />
                      </MenuButton>

                      <MenuItems className="status-menu-items">
                        <MenuItem>
                          <button
                            onClick={() => setStatusFilter("All Status")}
                            className="block w-full text-left px-4 py-2"
                          >
                            All Status
                          </button>
                        </MenuItem>
                        {filteredStatusOptions.map((status) => (
                          <MenuItem key={status}>
                            <button
                              className="status-menu-item"
                              onClick={() => setStatusFilter(status)}
                            >
                              {status}
                            </button>
                          </MenuItem>
                        ))}
                      </MenuItems>
                    </Menu>
                  </div>
                </div>
              </div>

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
                    {!hasReportData() ? (
                      <tr>
                        <td colSpan={5} className="monthly-report-empty">
                          No Data Found
                        </td>
                      </tr>
                    ) : (
                      Object.entries(monthData).map(([month, data]) => {
                        const formattedStatus = COMMON_SERVICES.formatText(
                          data.formStatus,
                        );

                        if (
                          formStatusFilter !== "All Form Status" &&
                          formStatusFilter !== formattedStatus
                        ) {
                          return null;
                        }

                        if (
                          statusFilter !== "All Status" &&
                          statusFilter !==
                            COMMON_SERVICES.formatText(
                              data.nextApprover?.status,
                            )
                        ) {
                          return null;
                        }

                        return (
                          <tr key={month}>
                            <td className="monthly-report-month">
                              {COMMON_SERVICES.formatText(month)}
                            </td>

                            <td>
                              <ApprovalMenu
                                workflows={data.pmFormApprovalWorkflow}
                                approverName={
                                  data.nextApprover?.approverNames || []
                                }
                              />
                            </td>

                            <td>
                              <span className="monthly-report-badge">
                                {formattedStatus}
                              </span>
                            </td>

                            <td>
                              <span className="monthly-report-status">
                                {COMMON_SERVICES.formatText(
                                  data.nextApprover?.status,
                                )}
                              </span>
                            </td>

                            <td>
                              <span className="commentIcon">
                                {data.commentCount || 0}
                              </span>
                            </td>
                          </tr>
                        );
                      })
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
