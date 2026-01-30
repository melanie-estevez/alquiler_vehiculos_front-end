import type { RouteObject } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import RequireRole from "./RequireRole";
import PublicLayout from "../layouts/PublicLayout";

import DashboardHome from "../pages/private/DashboardHome";
import SucursalesPage from "../pages/private/SucursalesPage";
import VehiculosPage from "../pages/private/VehiculosPage";
import ReservasPage from "../pages/private/ReservasPage";
import MantenimientosPage from "../pages/private/MantenimientosPage";
import ProfilePage from "../pages/private/ProfilePage";

import AuditoriaReservaPage from "../pages/private/AuditoriaReservaPage";
import FacturasPage from "../pages/private/FacturasPage";
import PagosPage from "../pages/private/PagosPage";

export const privateRoutes = {
  element: <RequireAuth />,
  children: [
    {
      element: <PublicLayout />,
      children: [
        { path: "/dashboard", element: <DashboardHome /> },
        { path: "/profile", element: <ProfilePage /> },

        // ADMIN
        {
          path: "/admin/sucursales",
          element: (
            <RequireRole role="admin">
              <SucursalesPage />
            </RequireRole>
          ),
        },
        {
          path: "/admin/vehiculos",
          element: (
            <RequireRole role="admin">
              <VehiculosPage />
            </RequireRole>
          ),
        },
        {
          path: "/admin/reservas",
          element: (
            <RequireRole role="admin">
              <ReservasPage />
            </RequireRole>
          ),
        },
        {
          path: "/admin/mantenimientos",
          element: (
            <RequireRole role="admin">
              <MantenimientosPage />
            </RequireRole>
          ),
        },
        {
          path: "/admin/facturas",
          element: (
            <RequireRole role="admin">
              <FacturasPage />
            </RequireRole>
          ),
        },
        {
          path: "/admin/pagos",
          element: (
            <RequireRole role="admin">
              <PagosPage />
            </RequireRole>
          ),
        },
        {
          path: "/admin/auditoria",
          element: (
            <RequireRole role="admin">
              <AuditoriaReservaPage />
            </RequireRole>
          ),
        },
      ],
    },
  ],
} satisfies RouteObject;
