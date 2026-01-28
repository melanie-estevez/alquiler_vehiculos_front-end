import type { JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/logo.png";
import logoText from "../../assets/logoText.png";

export default function PublicHeader(): JSX.Element {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top"
      style={{ backgroundColor: "#000000" }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="logo"
            width="60"
            height="35"
            className="d-inline-block align-text-top ms-3"
          />
          <img
            src={logoText}
            alt="logo text"
            width="100"
            height="35"
            className="d-inline-block align-text-top ms-2"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/carros">
                Carros
              </Link>
            </li>

            {/* ADMIN MENU */}
            {user && isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/sucursales">
                    Sucursales
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/vehiculos">
                    Vehículos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/reservas">
                    Reservas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/mantenimientos">
                    Mantenimientos
                  </Link>
                </li>
              </>
            )}

            {/* AUTH BUTTONS */}
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/auth/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <Link className="btn btn-outline-light" to="/auth/register">
                    Sign-up
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown ms-2">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ borderColor: "#ffffff" }}
                >
                  <span
                    className="rounded-circle bg-light text-dark d-inline-flex align-items-center justify-content-center me-2"
                    style={{ width: 28, height: 28, fontWeight: 700 }}
                    title={user.email}
                  >
                    {user.email?.[0]?.toUpperCase()}
                  </span>
                  <span className="d-none d-md-inline">{user.email}</span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/profile")}
                    >
                      Perfil
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={onLogout}
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
