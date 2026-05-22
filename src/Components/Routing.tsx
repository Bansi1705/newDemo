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

export const Routing = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGuard required={false}>
        <Suspense fallback={<Loader />}>
          <Login />
        </Suspense>
      </AuthGuard>
    ),
  },
  {
    path: "/home",
    element: (
      <AuthGuard required={true}>
        <Suspense fallback={<Loader />}>
          <Home />
        </Suspense>
      </AuthGuard>
    ),
  },
  {
    path: "/add-user",
    element: (
      <AuthGuard required={true}>
        <Suspense fallback={<Loader />}>
          <Form />
        </Suspense>
      </AuthGuard>
    ),
  },
  {
    path: "/edit-user/:id",
    element: (
      <AuthGuard required={true}>
        <Suspense fallback={<Loader />}>
          <Form />
        </Suspense>
      </AuthGuard>
    ),
  },
  {
    path: "userExpense",
    element: (
      <AuthGuard required={true}>
        <Suspense fallback={<Loader />}>
          <UserExpense />
        </Suspense>
      </AuthGuard>
    ),
  },
  {
    path: "/data",
    element: (
      <AuthGuard required={true}>
        <Suspense fallback={<Loader />}>
          <Data />
        </Suspense>
      </AuthGuard>
    ),
  },
  {
    path: "/roomData",
    element: (
      <AuthGuard required={true}>
        <Suspense fallback={<Loader />}>
          <RoomData />
        </Suspense>
      </AuthGuard>
    ),
  },
  {
    path: "/propertyData",
    element: (
      <AuthGuard required={true}>
        <Suspense fallback={<Loader />}>
          <PropertyData />
        </Suspense>{" "}
      </AuthGuard>
    ),
  },
  {
    path: "/property",
    element: (
      <AuthGuard required={true}>                                 
        <Suspense fallback={<Loader />}>
          <Property />
        </Suspense>
      </AuthGuard>
    ),
  },
  {
    path: "/chartData",
    element: (
      <AuthGuard required={true}>
        <Suspense fallback={<Loader />}>
          <ApexChart />
        </Suspense>{" "}
      </AuthGuard>
    ),
  },
  {
    path: "/propertyCard",
    element: (
      <AuthGuard required={true}>
        <Suspense fallback={<Loader />}>
          <PropertyCard />
        </Suspense>
      </AuthGuard>
    ),
  },
  {
    path: "/propertyWiseCard",
    element: (
      <AuthGuard required={true}>
        <Suspense fallback={<Loader />}>
          <PropertyWiseCard />
        </Suspense>
      </AuthGuard>
    ),
  },
  {
    path: "/monthlyReport",
    element: (
      <AuthGuard required={true}>
        <Suspense fallback={<Loader />}>
          <MonthlyReports />
        </Suspense>
      </AuthGuard>
    ),
  },
  {
    path: "/capitalExpense",
    element: (
      <AuthGuard required={true}>
        <Suspense fallback={<Loader />}>
          <CapitalExpense />
        </Suspense>
      </AuthGuard>
    ),
  },
  {
    path: "/userProfile",
    element: (
      <AuthGuard required={true}>
        <Suspense fallback={<Loader />}>
          <UserProfile />
        </Suspense>
      </AuthGuard>
    ),
  },
]);
