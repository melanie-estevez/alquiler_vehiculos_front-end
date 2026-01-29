import { Outlet } from "react-router-dom";
import PublicHeader from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";

export default function PublicLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <PublicHeader />

      
      <main className="flex-grow-1 pt-5" style={{ paddingTop: 72 }}>
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
}
