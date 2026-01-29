export default function PublicFooter() {
  return (
    <footer className="footer-dark mt-auto">
      <div className="container py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <div className="small">
            © {new Date().getFullYear()} Lumi — Todos los derechos reservados
          </div>

          <div className="d-flex gap-3 small">
            <span>Soporte</span>
            <span>Privacidad</span>
            <span>Términos</span>
          </div>
        </div>
      </div>
    </footer>
  );
}