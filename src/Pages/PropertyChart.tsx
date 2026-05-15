import { useEffect, useState } from "react";
import type { ApiResponse } from "../Interface/types";
import { Apiservice } from "../Services/ApiService";
import { toast } from "react-toastify";
import { CONSTANT } from "../Services/Constant";
import type { ApexOptions } from "apexcharts";
import CommonChart from "../Components/CommonComponents/Chart";

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

export const PropertyChart: React.FC = () => {
  const [propertyData, setPropertyData] = useState<NextData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: ApiResponse<NextData> = await Apiservice.get("/NextData");
        setPropertyData(res.data);
      } catch {
        toast.error(CONSTANT.ERROR.NOT_FOUND);
      }
    };

    fetchData();
  }, []);

  const statusData = propertyData?.totalStatistics;

  const pieChartSeries = [
    statusData?.APPROVED || 0,
    statusData?.PENDING || 0,
    statusData?.REJECTED || 0,
    statusData?.EARLY || 0,
    statusData?.ON_TIME || 0,
    statusData?.LATE || 0,
  ];

  const pieChartOptions = {
    labels: ["Approved", "Pending", "Rejected", "Early", "ON_Time", "Late"],
    title: {
      text: "Overall Form Status",
      align: "center",
    },
    legend: {
      position: "bottom",
    },
  } as ApexOptions;

  const barChartSeries = [
    {
      name: "Total Forms",
      data: propertyData?.propertyStatistics.map(
        (property) => property.pmForms.length,
      ) ,
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
      categories: propertyData?.propertyStatistics.map(
        (data) => data.propertyName,
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
    <>
      <section className="chart-card">
        <CommonChart 
         type="bar"
          series={barChartSeries}
          options={barChartOptions}
         />
      </section>

      <section className="chart-card">
        <CommonChart
          type="pie"
          series={pieChartSeries}
          options={pieChartOptions}
        />
      </section>
    </>
  );
};
