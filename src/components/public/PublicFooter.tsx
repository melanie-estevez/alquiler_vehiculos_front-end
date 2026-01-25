import type { JSX } from 'react';
import { FaInstagram, FaFacebookF } from 'react-icons/fa'; 

export default function Footer(): JSX.Element {
  return (
    <footer className="bg-dark text-white text-center py-3 fixed-bottom">
      <div className="container">
        <p className="mb-1">© 2026 - Todos los derechos reservados</p>
        <div>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
            <FaInstagram size={20} />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-white">
            <FaFacebookF size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
