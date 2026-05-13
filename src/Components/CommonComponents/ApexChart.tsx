import { useEffect, useState } from "react";
import Header from "../Header";
import { Apiservice } from "../../Services/ApiService";
import type { ApiResponse } from "../../Interface/types";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import "../../Styles/ApexChart.css";
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

export const ApexChart: React.FC = () => {
  const [chartData, setChartData] = useState<chartDataInterface>({
    distributionAnalysis: [],
    occupancyStatistics: {
      checkInPercentage: 0,
      checkOutPercentage: 0,
      total: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: ApiResponse<chartDataInterface> =
          await Apiservice.get("/chartData");
        setChartData(res.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredDistributionData = chartData.distributionAnalysis.filter(
    (data) => data.total > 0,
  );
  const pieChartSeries =
    chartData.occupancyStatistics.total > 0
      ? [
          chartData.occupancyStatistics.checkInPercentage,
          chartData.occupancyStatistics.checkOutPercentage,
        ]
      : [0, 0];
  const pieChartOptions = {
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

  const barChartseries = [
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

  const barChartOptions = {
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

  const lineChartseries = [
    {
      name: "Total Employee Activity",
      data: filteredDistributionData.map((data) => data.total),
    },
  ];

  const lineChartOptions = {
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

  return (
    <div className="chart-page">
      <Header />

      <section className="barChart-card">
        <ReactApexChart
          type="bar"
          series={barChartseries}
          options={barChartOptions}
          width="100%"
          height={400}
        />
      </section>

      <main className="chart-content">
        <section className="chart-card">
          <ReactApexChart
            type="line"
            series={lineChartseries}
            options={lineChartOptions}
            width={500}
            height={320}
          />
        </section>

        <section className="chart-card">
          <ReactApexChart
            type="pie"
            series={pieChartSeries}
            options={pieChartOptions}
            width={500}
            height={320}
          />
        </section>
      </main>
    </div>
  );
};
