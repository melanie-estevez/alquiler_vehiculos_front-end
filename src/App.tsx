import PublicFooter from "./components/public/PublicFooter";
import PublicHeader from "./components/public/PublicHeader";
import SucursalesPage from "./pages/private/SucursalesPage";
import VehiculosPage from "./pages/private/VehiculosPage";
function App() {
  return (
    <div>
      <PublicHeader />
      <PublicFooter/>
      <SucursalesPage />
      <VehiculosPage />
    </div>
  );
}

export default App;
