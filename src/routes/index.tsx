import publicRoutes from "./public.routes";
import { privateRoutes } from "./private.routes";
import type { RouteObject } from "react-router-dom";

export const appRoutes: RouteObject[] = [
  publicRoutes,
  privateRoutes,
];
