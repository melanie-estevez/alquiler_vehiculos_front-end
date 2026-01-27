import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import logoText from "../../assets/logoText.png";

export default function PublicHeader() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav
      className="navbar navbar-expand-lg border-bottom"
      style={{ backgroundColor: "#000000" }}
    >
      <div className="container">
        {/* LOGO */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Logo" height="36" className="me-2" />
          {logoText && (
            <img src={logoText} alt="RentCar" height="28" />
          )}
        </Link>

        <div className="collapse navbar-collapse show">
          {/* LEFT */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link text-white fw-semibold" to="/">
                Home
              </Link>
            </li>

            {/* 🔐 ADMIN LINKS */}
            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link text-white fw-semibold"
                    to="/admin/vehiculos"
                  >
                    Vehículos
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link text-white fw-semibold"
                    to="/admin/sucursales"
                  >
                    Sucursales
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* RIGHT */}
          <div className="d-flex align-items-center gap-3">
            {!user ? (
              <>
                <Link
                  to="/auth/login"
                  className="btn btn-outline-light"
                >
                  Login
                </Link>

                <Link
                  to="/auth/register"
                  className="btn btn-light fw-semibold"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <span className="text-white small">
                  {user.email}
                </span>

                <button
                  className="btn btn-outline-light"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
