import { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Apiservice } from "../Services/ApiService";
import type { ApiResponse } from "../Interface/types";
import type { ApexOptions } from "apexcharts";
import "../Styles/ApexChart.css";
import CommonChart from "../Components/CommonComponents/Chart";
import Loader from "../Components/CommonComponents/Loader";
import Toaster from "../Services/CommonService/ToasterHelper";
import { CONSTANT } from "../Services/Constant";
interface DistributionAnalysis {
  propertyName: string;
  punchIns: number;
  punchOuts: number;
  total: number;
  propertyId: number;
}

interface chartDataInterface {
  distributionAnalysis: DistributionAnalysis[];
  occupancyStatistics: {
    checkInPercentage: number;
    checkOutPercentage: number;
    total: number;
  };
}

interface PropertyPaymentDetails {
  totalInvoices: string;
  totalInvoiceAmount: string;
  underApprovalAmount: string;
  m3AutoPayCount: string;
}

interface PaymentTotals {
  totalInvoices: number;
  totalInvoiceAmount: number;
}

interface PaymentDetails {
  propertyWisePaymentDetails: Record<string, PropertyPaymentDetails>;
  totals: PaymentTotals;
}

interface PmFormItem {
  id: number;
  propertyId: number;
  formId: number;
  formStatus: string;
}

interface PmForms {
  formId: number;
  formName: string;
  formType: string;
  pmForms: PmFormItem[];
  stats: any;
  formStatus: string;
  isExcludeFromNotify: boolean;
}

interface PropertyStatistics {
  propertyName: string;
  pmForms: PmForms[];
}

interface TotalStatistics {
  total: number;
  APPROVED: number;
  PENDING: number;
  REJECTED: number;
  EARLY: number;
  ON_TIME: number;
  LATE: number;
  formStatus: Record<string, number>;
}

interface NextData {
  propertyStatistics: PropertyStatistics[];
  totalStatistics: TotalStatistics;
}

const ApexChart: React.FC = () => {
  const [chartData, setChartData] = useState<chartDataInterface>({
    distributionAnalysis: [],
    occupancyStatistics: {
      checkInPercentage: 0,
      checkOutPercentage: 0,
      total: 0,
    },
  });

  const [paymentDetailsChartData, setPaymentDetailsChartData] =
    useState<PaymentDetails>({
      propertyWisePaymentDetails: {},
      totals: {
        totalInvoices: 0,
        totalInvoiceAmount: 0,
      },
    });
  const [propertyData, setPropertyData] = useState<NextData | null>(null);
  const [loadingChart, setLoadingChart] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingChart(true);
        const res: ApiResponse<chartDataInterface> =
          await Apiservice.get("/chartData");
        const paymentRes: ApiResponse<PaymentDetails> =
          await Apiservice.get("/paymentDetails");
        setPaymentDetailsChartData(paymentRes.data);
        setChartData(res.data);
        const nextDataRes: ApiResponse<NextData> =
          await Apiservice.get("/NextData");
        setPropertyData(nextDataRes.data);
      } catch {
        Toaster.error(CONSTANT.TOAST_ERROR_MSG.NOT_FOUND);
      } finally {
        setTimeout(() => {
          setLoadingChart(false);
        }, 2000);
      }
    };

    fetchData();
  }, []);

  const filteredDistributionData = chartData.distributionAnalysis.filter(
    (data) => data.total > 0,
  );
  const occupancyStatisticsPieChartSeries =
    chartData.occupancyStatistics.total > 0
      ? [
          chartData.occupancyStatistics.checkInPercentage,
          chartData.occupancyStatistics.checkOutPercentage,
        ]
      : [0, 0];
  const occupancyStatisticsPieChartOptions = {
    labels:
      chartData.occupancyStatistics.total > 0
        ? ["Check Ins", "Check Outs"]
        : ["No Data"],

    title: {
      text: "Occupancy Statistics Overview",
      align: "center",
    },

    legend: {
      position: "bottom",
    },
  } as ApexOptions;

  const distributionAnalysisBarChartseries = [
    {
      name: "Total",
      data: filteredDistributionData.map((data) => data.total),
    },
    {
      name: "Punch Ins",
      data: filteredDistributionData.map((data) => data.punchIns),
    },
    {
      name: "Punch Outs",
      data: filteredDistributionData.map((data) => data.punchOuts),
    },
  ];

  const distributionAnalysisBarChartOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },

    tooltip: {
      enabled: true,
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: filteredDistributionData.map((data) => data.propertyName),
      labels: {
        rotate: -40,
        hideOverlappingLabels: true,
        style: {
          fontSize: "7px",
        },
      },
    },

    yaxis: {
      labels: {
        show: true,
      },
    },

    title: {
      text: "Punch In and Punch Out Distribution by Property",
      align: "center",
    },
  } as ApexOptions;

  const TotalActivitylineChartSeries = [
    {
      name: "Total Employee Activity",
      data: filteredDistributionData.map((data) => data.total),
    },
  ];

  const TotalActivitylineChartOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
    },

    tooltip: {
      enabled: true,
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: filteredDistributionData.map((data) => data.propertyName),
      labels: {
        rotate: -40,
        trim: true,
        hideOverlappingLabels: true,
        style: {
          fontSize: "7px",
        },
      },
      position: "bottom",
    },

    yaxis: {
      labels: {
        show: true,
      },
    },

    title: {
      text: "Property-wise Total Activity Overview",
      align: "center",
    },
  } as ApexOptions;

  const paymentDetailsLineChartSeries = [
    {
      name: "Total Invoice Amount",
      data: Object.values(
        paymentDetailsChartData.propertyWisePaymentDetails,
      ).map((data) => Number(data.totalInvoiceAmount)),
    },
  ];

  const paymentDetailsLineChartOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
    },

    tooltip: {
      enabled: true,
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: Object.entries(
        paymentDetailsChartData.propertyWisePaymentDetails,
      ).map(([i]) => i),
      labels: {
        rotate: -40,
        trim: true,
        hideOverlappingLabels: true,
        style: {
          fontSize: "7px",
        },
      },
      position: "bottom",
    },

    yaxis: {
      labels: {
        show: true,
      },
    },

    title: {
      text: "Property-wise Total Invoice Amount Overview",
      align: "center",
    },
  } as ApexOptions;

  const paymentDetailsBarChartSeries = [
    {
      name: "Total Invoice Amount",
      data: Object.values(
        paymentDetailsChartData.propertyWisePaymentDetails,
      ).map((data) => Number(data.totalInvoiceAmount)),
    },
    {
      name: "Under Approval Amount",
      data: Object.values(
        paymentDetailsChartData.propertyWisePaymentDetails,
      ).map((data) => Number(data.underApprovalAmount)),
    },
  ];

  const paymentDetailsBarChartOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },

    tooltip: {
      enabled: true,
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: Object.entries(
        paymentDetailsChartData.propertyWisePaymentDetails,
      ).map(([i]) => i),
      labels: {
        rotate: -40,
        trim: true,
        hideOverlappingLabels: true,
        style: {
          fontSize: "7px",
        },
      },
      position: "bottom",
    },

    yaxis: {
      labels: {
        show: true,
      },
    },

    title: {
      text: "Property-wise Total Invoice Amount Overview",
      align: "center",
    },
  } as ApexOptions;

  const statusData = propertyData?.totalStatistics;

  const formStatusPieSeries = [
    statusData?.APPROVED || 0,
    statusData?.PENDING || 0,
    statusData?.REJECTED || 0,
    statusData?.EARLY || 0,
    statusData?.ON_TIME || 0,
    statusData?.LATE || 0,
  ];

  const formStatusPieOptions = {
    labels: ["Approved", "Pending", "Rejected", "Early", "ON_Time", "Late"],
    title: {
      text: "Overall Form Status",
      align: "center",
    },
    legend: {
      position: "bottom",
    },
  } as ApexOptions;

  const formStatusBarSeries = [
    {
      name: "Total Forms",
      data: propertyData?.propertyStatistics.map(
        (property) => property.pmForms.length,
      ),
    },
    {
      name: "Pending Forms",
      data: propertyData?.propertyStatistics.map(
        (property) =>
          property.pmForms.filter((form) => form.formStatus === "PENDING")
            .length,
      ),
    },
    {
      name: "Approved Forms",
      data: propertyData?.propertyStatistics.map(
        (property) =>
          property.pmForms.filter((form) => form.formStatus === "APPROVED")
            .length,
      ),
    },
  ];

  const formStatusBarOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },

    tooltip: {
      enabled: true,
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: propertyData?.propertyStatistics.map(
        (property) => property.propertyName,
      ),
      labels: {
        rotate: -40,
        trim: true,
        hideOverlappingLabels: true,
        style: {
          fontSize: "7px",
        },
      },
    },

    yaxis: {
      labels: {
        show: true,
      },
    },

    title: {
      text: "Form Status by Property",
      align: "center",
    },
  } as ApexOptions;
  return (
    <div className="chart-page" data-testid="chart-data">
      <div>
        <Header />
        <section className="barChart-card">
          <CommonChart
            type="bar"
            series={distributionAnalysisBarChartseries}
            options={distributionAnalysisBarChartOptions}
          />
        </section>

        <main className="chart-content">
          <section className="chart-card">
            <CommonChart
              type="line"
              series={TotalActivitylineChartSeries}
              options={TotalActivitylineChartOptions}
            />
          </section>

          <section className="chart-card">
            <CommonChart
              type="pie"
              series={occupancyStatisticsPieChartSeries}
              options={occupancyStatisticsPieChartOptions}
            />
          </section>

          <section className="chart-card">
            <CommonChart
              type="bar"
              series={formStatusBarSeries}
              options={formStatusBarOptions}
            />
          </section>

          <section className="chart-card">
            <CommonChart
              type="pie"
              series={formStatusPieSeries}
              options={formStatusPieOptions}
            />
          </section>

          <section className="chart-card">
            <CommonChart
              type="line"
              series={paymentDetailsLineChartSeries}
              options={paymentDetailsLineChartOptions}
            />
          </section>

          <section className="chart-card">
            <CommonChart
              type="bar"
              series={paymentDetailsBarChartSeries}
              options={paymentDetailsBarChartOptions}
            />
          </section>
        </main>
      </div>
      {loadingChart && <Loader />}
    </div>
  );
};

export default ApexChart;
