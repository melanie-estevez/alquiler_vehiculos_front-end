import { Outlet } from "react-router-dom";
import PublicHeader from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";

export default function PublicLayout() {
  return (
    <>
      <PublicHeader />
      <main className="min-vh-100">
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
}
