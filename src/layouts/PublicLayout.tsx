import { Outlet } from "react-router-dom";
import PublicHeader from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";

export default function PublicLayout() {
  return (
    <div className="min-vh-100 d-flex flex-column">
    
      <PublicHeader />

    
      <main className="flex-grow-1 pt-5">
        <Outlet />
      </main>

      
      <PublicFooter />
    </div>
  );
}
