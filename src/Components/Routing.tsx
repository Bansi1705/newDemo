import { createBrowserRouter } from "react-router-dom";
import { AuthGuard } from "./Auth/AuthGuard";
import { Suspense } from "react";
import Loader from "./CommonComponents/Loader";

import {
  ApexChart,
  CapitalExpense,
  Data,
  Form,
  Home,
  Login,
  MonthlyReports,
  Property,
  PropertyCard,
  PropertyData,
  PropertyWiseCard,
  RoomData,
  UserExpense,
  UserProfile,
} from "./LazyLoading";

const routingPages = [
  { path: "/", component: Login, required: false },
  { path: "/home", component: Home, required: true },
  { path: "/add-user", component: Form, required: true },
  { path: "/edit-user/:id", component: Form, required: true },
  { path: "/userExpense", component: UserExpense, required: true },
  { path: "/data", component: Data, required: true },
  { path: "/roomData", component: RoomData, required: true },
  { path: "/propertyData", component: PropertyData, required: true },
  { path: "/property", component: Property, required: true },
  { path: "/chartData", component: ApexChart, required: true },
  { path: "/propertyCard", component: PropertyCard, required: true },
  { path: "/propertyWiseCard", component: PropertyWiseCard, required: true },
  { path: "/monthlyReport", component: MonthlyReports, required: true },
  { path: "/capitalExpense", component: CapitalExpense, required: true },
  { path: "/userProfile", component: UserProfile, required: true },
];

export const Routing = createBrowserRouter(
  routingPages.map((item) => ({
    path: item.path,
    element: (
      <AuthGuard required={item.required}>
        <Suspense fallback={<Loader />}>
          <item.component />
        </Suspense>
      </AuthGuard>
    ),
  })),
);
