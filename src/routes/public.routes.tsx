import type { RouteObject } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import HomePage from "../pages/public/HomePage";
import CarrosPage from "../pages/public/CarrosPage";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import PublicOnly from "./PublicOnly";
import ReservaCreatePage from "../pages/public/ReservaCreatePage";
import ClienteCreatePage from "../pages/public/ClienteCreatePage";
import MisReservasPage from "../pages/public/MisReservasPage";
import FacturaReservaPage from "../pages/public/FacturaReservaPage";
import ReservaTimelinePage from "../pages/public/ReservaTimelinePage";
import ProtectedRoute from "./ProtectedRoute";
import PagarFacturaPage from "../pages/public/PagarFacturaPage";

const publicRoutes: RouteObject = {
  element: <PublicLayout />,
  children: [
    { path: "/", element: <HomePage /> },
    { path: "/carros", element: <CarrosPage /> },

    { path: "/reservar/:id", element: <ProtectedRoute><ReservaCreatePage /></ProtectedRoute> },
    { path: "/cliente/create", element: <ProtectedRoute><ClienteCreatePage /></ProtectedRoute> },

    { path: "/mis-reservas", element: <ProtectedRoute><MisReservasPage /></ProtectedRoute> },
    { path: "/factura/reserva/:idReserva", element: <ProtectedRoute><FacturaReservaPage /></ProtectedRoute> },
    { path: "/pagar/:idFactura", element: <ProtectedRoute><PagarFacturaPage /></ProtectedRoute> },
    { path: "/reserva/:idReserva/timeline", element: <ProtectedRoute><ReservaTimelinePage /></ProtectedRoute> },

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