import React from "react";

export const Login = React.lazy(() => import("./Login"));
export const Home = React.lazy(() => import("../Pages/Home"));
export const MonthlyReports = React.lazy(
  () => import("../Pages/MonthlyReports"),
);
export const CapitalExpense = React.lazy(
  () => import("../Pages/CapitalExpense"),
);
export const UserExpense = React.lazy(() => import("../Pages/UserExpense"));
export const Data = React.lazy(() => import("../Pages/Data"));
export const Form = React.lazy(() => import("./Form"));
export const Property = React.lazy(() => import("../Pages/Property"));
export const RoomData = React.lazy(() => import("../Pages/RoomData"));
export const PropertyData = React.lazy(() => import("../Pages/PropertyData"));
export const PropertyCard = React.lazy(() => import("../Pages/PropertyCard"));
export const PropertyWiseCard = React.lazy(
  () => import("../Pages/PropertWiseCard"),
);
export const ApexChart = React.lazy(() => import("../Pages/ApexChart"));
export const UserProfilePage = React.lazy(() => import("../Pages/UserProfile"));
export const PayRollData = React.lazy(() => import("../Pages/PayRollData"));
export const IncidentReport =React.lazy(()=>import("../Pages/IncidentReport"))

