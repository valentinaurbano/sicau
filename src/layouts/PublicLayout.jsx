import { Link, Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import '../styles/public.css'

export default function PublicLayout() {
  return (
    <div className="public-shell">
      <Navbar />
      <main className="public-main">
        <Outlet />
      </main>
      <footer className="public-footer">
        <div className="public-footer__brand">
          <span className="public-footer__mark" aria-hidden="true">UA</span>
          <span>
            <strong>Uniautónoma</strong>
            <small>Bienestar Universitario</small>
          </span>
        </div>
        <p>Experiencias que cuidan, conectan y hacen parte de la vida universitaria.</p>
        <nav className="public-footer__links" aria-label="Enlaces del pie de página">
          <Link to="/deportes">Deportes</Link>
          <Link to="/eventos">Eventos</Link>
          <Link to="/areas">Áreas de bienestar</Link>
        </nav>
        <small className="public-footer__copy">© 2026 Universidad Autónoma del Cauca</small>
      </footer>
    </div>
  )
}
