import { createBrowserRouter } from "react-router-dom";
import { Home } from "../Pages/Home";
import { Form } from "./Form";
import { Login } from "./Login";
import { AuthGuard } from "./Auth/AuthGuard";

export const Routing = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGuard required={false}> {/* Login page only for non-logged-in users */}
        <Login />
      </AuthGuard>
    ),
  },
  {
    path: "/home",
    element: (
      <AuthGuard required={true}> {/* Home page only for logged-in users */}
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
        <Form/>
      </AuthGuard>
    ),
  },
]);