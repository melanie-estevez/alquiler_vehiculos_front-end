import type { JSX } from "react";

export default function Footer(): JSX.Element {
  return (
    <footer
      className="text-white text-center py-3 mt-auto"
      style={{ backgroundColor: "#1f1f1f" }}
    >
      <small>© {new Date().getFullYear()} Lumi Rentals. Todos los derechos reservados.</small>
    </footer>
  );
}
