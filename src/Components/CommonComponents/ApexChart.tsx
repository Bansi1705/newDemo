import { useEffect, useState } from "react";
import Header from "../Header";
import { Apiservice } from "../../Services/ApiService";
import type { ApiResponse, User } from "../../Interface/types";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import "../../Styles/ApexChart.css";

export const ApexChart: React.FC = () => {
  const [chartData, setChartData] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: ApiResponse<User[]> = await Apiservice.get("/users");
        setChartData(res.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  const pieChartSeries = chartData.map((item) => item.age);
  const pieChartOptions = {
    labels: chartData.map((item) => item.name),

    title: {
      text: "Users Age Pie Chart",
      align: "center",
    },

    legend: {
      position: "bottom",
    },
  } as ApexOptions;

  const barChartseries = [
    {
      name: "Age",
      data: chartData.map((item) => item.age),
    },
  ];

  const barChartOptions = {
    chart: {
      height: 350,
      type: "bar",
    },

    tooltip: {
      enabled: false,
    },

    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top",
        },
      },
    },

    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },

    xaxis: {
      categories: chartData.map((item) => item.name),
      position: "buttom",
    },

    yaxis: {
      labels: {
        show: true,
      },
    },

    title: {
      text: "Users Age Chart",
      align: "center",
    },
  } as ApexOptions;

  return (
    <div className="chart-page">
      <Header />

      <main className="chart-content">
        <section className="chart-card">
          <ReactApexChart
            type="bar"
            series={barChartseries}
            options={barChartOptions}
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
