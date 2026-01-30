import type { RouteObject } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import HomePage from "../pages/public/HomePage";
import CarrosPage from "../pages/public/CarrosPage";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import PublicOnly from "./PublicOnly";
import ReservaCreatePage from "../pages/public/ReservaCreatePage";
import ClienteCreatePage from "../pages/public/ClienteCreatePage";

const publicRoutes: RouteObject = {
  element: <PublicLayout />,
  children: [
    { path: "/", element: <HomePage /> },
    { path: "/carros", element: <CarrosPage /> },
    { path: "/reservar/:id", element: <ReservaCreatePage /> },
    { path: "/cliente/create", element: <ClienteCreatePage /> },

    {
      path: "/auth/login",
      element: (
        <PublicOnly>
          <Login />
        </PublicOnly>
      ),
    },
    {
      path: "/auth/register",
      element: (
        <PublicOnly>
          <Register />
        </PublicOnly>
      ),
    },
  ],
};

export default publicRoutes;