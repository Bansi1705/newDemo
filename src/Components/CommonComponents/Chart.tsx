import React from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexAxisChartSeries, ApexNonAxisChartSeries, ApexOptions } from "apexcharts";

interface CommonChartProps {
  options: ApexOptions;
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  type:
    | "line"
    | "bar"
    | "pie"
    | "donut";
  height?: number;
  width?: string | number;
}

const CommonChart: React.FC<CommonChartProps> = ({
  options,
  series,
  type,
  height = 350,
  width = "100%",
}) => {
  return (
    <ReactApexChart
      options={options}
      series={series}
      type={type}
      height={height}
      width={width}
      data-testid="common-charts"
    />
  );
};

export default CommonChart;