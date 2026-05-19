import { createBrowserRouter } from "react-router-dom";
import { Home } from "../Pages/Home";
import { Form } from "./Form";
import { Login } from "./Login";
import { AuthGuard } from "./Auth/AuthGuard";
import UserExpense from "../Pages/UserExpense";
import Data from "../Pages/Data";
import { RoomData } from "../Pages/RoomData";
import { PropertyData } from "../Pages/PropertyData";
import { Property } from "./Property";
import { ApexChart } from "../Pages/ApexChart";
import { PropertyCard } from "../Pages/PropertyCard";
import { PropertyWiseCard } from "../Pages/PropertWiseCard";
import MonthlyReports from "../Pages/MonthlyReports";

export const Routing = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGuard required={false}>
        <Login />
      </AuthGuard>
    ),
  },
  {
    path: "/home",
    element: (
      <AuthGuard required={true}>
        <Home />
      </AuthGuard>
    ),
  },
  {
    path: "/add-user",
    element: (
      <AuthGuard required={true}>
        <Form />
      </AuthGuard>
    ),
  },
  {
    path: "/edit-user/:id",
    element: (
      <AuthGuard required={true}>
        <Form />
      </AuthGuard>
    ),
  },
  {
    path: "userExpense",
    element: (
      <AuthGuard required={true}>
        <UserExpense />
      </AuthGuard>
    ),
  },
  {
    path: "/data",
    element: (
      <AuthGuard required={true}>
        <Data />
      </AuthGuard>
    ),
  },
  {
    path: "/roomData",
    element: (
      <AuthGuard required={true}>
        <RoomData />
      </AuthGuard>
    ),
  },
  {
    path: "/propertyData",
    element: (
      <AuthGuard required={true}>
        <PropertyData />
      </AuthGuard>
    ),
  },
  {
    path: "/property",
    element: (
      <AuthGuard required={true}>
        <Property />
      </AuthGuard>
    ),
  },
  {
    path: "/chartData",
    element: (
      <AuthGuard required={true}>
        <ApexChart />
      </AuthGuard>
    ),
  },
  {
    path: "/propertyCard",
    element: (
      <AuthGuard required={true}>
        <PropertyCard />
      </AuthGuard>
    ),
  },
  {
    path: "/propertyWiseCard",
    element: (
      <AuthGuard required={true}>
        <PropertyWiseCard />
      </AuthGuard>
    ),
  },
  {
    path: "/monthlyReport",
    element: (
      <AuthGuard required={true}>
        <MonthlyReports />
      </AuthGuard>
    ),
  },
]);
