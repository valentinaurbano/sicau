import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

// Ajusta las rutas `to` a las de tu router.
const PRINCIPAL = [
  { label: 'Inicio', to: '/', end: true },
  { label: 'Eventos', to: '/eventos' },
  { label: 'Deportes', to: '/deportes' },
]

// Sin `to` = todavía no tiene página. Cuando la tenga, agrega `to` y se vuelve enlace.
const AREAS = [
  { label: 'Desarrollo Humano y Orientación', estado: 'En desarrollo' },
  { label: 'Permanencia Estudiantil', estado: 'Próximamente' },
  { label: 'Salud Integral', estado: 'En desarrollo' },
  { label: 'Cultura', estado: 'Próximamente' },
]

export default function Navbar({ user, onLogout }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [areasAbierto, setAreasAbierto] = useState(false)
  const areasRef = useRef(null)

  // Cierra el desplegable al hacer clic fuera o con Escape
  useEffect(() => {
    if (!areasAbierto) return
    const fuera = (e) => {
      if (!areasRef.current?.contains(e.target)) setAreasAbierto(false)
    }
    const tecla = (e) => e.key === 'Escape' && setAreasAbierto(false)
    document.addEventListener('mousedown', fuera)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('mousedown', fuera)
      document.removeEventListener('keydown', tecla)
    }
  }, [areasAbierto])

  const cerrar = () => {
    setMenuAbierto(false)
    setAreasAbierto(false)
  }

  return (
    <nav className="navbar" aria-label="Principal">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={cerrar}>
          <span className="navbar__mark" aria-hidden="true">UA</span>
          <span className="navbar__name">
            Bienestar
            <small>Uniautónoma</small>
          </span>
        </Link>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={menuAbierto}
          aria-controls="navbar-menu"
          onClick={() => setMenuAbierto((v) => !v)}
        >
          <span className="navbar__sr">{menuAbierto ? 'Cerrar menú' : 'Abrir menú'}</span>
          <span className="navbar__bars" aria-hidden="true" />
        </button>

        <div id="navbar-menu" className={`navbar__menu${menuAbierto ? ' is-open' : ''}`}>
          <ul className="navbar__links">
            {PRINCIPAL.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `navbar__link${isActive ? ' is-active' : ''}`}
                  onClick={cerrar}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}

            <li className="navbar__areas" ref={areasRef}>
              <button
                type="button"
                className="navbar__link navbar__link--button"
                aria-expanded={areasAbierto}
                aria-controls="navbar-areas"
                onClick={() => setAreasAbierto((v) => !v)}
              >
                Otras áreas
                <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                  <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <ul id="navbar-areas" className={`navbar__panel${areasAbierto ? ' is-open' : ''}`}>
                {AREAS.map((area) => (
                  <li key={area.label}>
                    {area.to ? (
                      <NavLink to={area.to} className="navbar__area" onClick={cerrar}>
                        <span>{area.label}</span>
                        <em className="navbar__tag">{area.estado}</em>
                      </NavLink>
                    ) : (
                      <span className="navbar__area is-pending" aria-disabled="true">
                        <span>{area.label}</span>
                        <em className="navbar__tag">{area.estado}</em>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          <div className="navbar__session">
            {user ? (
              <>
                <span className="navbar__user">{user.nombre.split(' ')[0]}</span>
                {onLogout && (
                  <button type="button" className="navbar__out" onClick={() => { cerrar(); onLogout() }}>
                    Cerrar sesión
                  </button>
                )}
              </>
            ) : (
              <Link to="/login" className="navbar__login" onClick={cerrar}>
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}