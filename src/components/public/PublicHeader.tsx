import type { JSX } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import logoText from "../../assets/logoText.png";
export default function PublicHeader(): JSX.Element {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{ backgroundColor: "#000000" }} >
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
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
          </a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/auth/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-light ms-2" to="/auth/register">Sign-up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
