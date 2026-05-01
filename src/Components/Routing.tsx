import { createBrowserRouter } from "react-router-dom";
import { Home } from "../Pages/Home";
import { Form } from "./Form";
import { Login } from "./Login";
import { AuthGuard } from "./Auth/AuthGuard";
import UserExpense from "../Pages/UserExpense";
import Data from "../Pages/Data";
import { RoomData } from "../Pages/RoomData";
import { PropertyData } from "../Pages/PropertyData";

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
  }, {
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
]);
