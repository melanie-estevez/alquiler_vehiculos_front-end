import type { RouteObject } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import RequireRole from "./RequireRole";
import PublicLayout from "../layouts/PublicLayout";

import DashboardHome from "../pages/private/DashboardHome";
import SucursalesPage from "../pages/private/SucursalesPage";
import VehiculosPage from "../pages/private/VehiculosPage";
import ReservasPage from "../pages/private/ReservasPage";
import MantenimientosPage from "../pages/private/MantenimientosPage";

import { Role } from "../utils/roles";

export const privateRoutes: RouteObject = {
  element: <RequireAuth />,
  children: [
    {
      element: <PublicLayout />,
      children: [
        { path: "/dashboard", element: <DashboardHome /> },

        {
          path: "/admin/sucursales",
          element: (
            <RequireRole role={Role.ADMIN}>
              <SucursalesPage />
            </RequireRole>
          ),
        },

        {
          path: "/admin/vehiculos",
          element: (
            <RequireRole role={Role.ADMIN}>
              <VehiculosPage />
            </RequireRole>
          ),
        },

        {
          path: "/admin/reservas",
          element: (
            <RequireRole role={Role.ADMIN}>
              <ReservasPage />
            </RequireRole>
          ),
        },

        {
          path: "/admin/mantenimientos",
          element: (
            <RequireRole role={Role.ADMIN}>
              <MantenimientosPage />
            </RequireRole>
          ),
        },
      ],
    },
  ],
};
