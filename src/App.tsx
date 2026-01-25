import SucursalesPage from "./pages/private/SucursalesPage";
import VehiculosPage from "./pages/private/VehiculosPage";
import PublicHeader from "./components/public/PublicHeader";
import PublicFooter from "./components/public/PublicFooter";
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