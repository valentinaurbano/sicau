import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store/StoreContext.jsx'
import { MODULOS_PROXIMOS } from '../components/home/modulosProximos.js'
import './Navbar.css'

const PRINCIPAL = [
  { label: 'Inicio', to: '/', end: true },
  { label: 'Deportes', to: '/deportes' },
  { label: 'Eventos', to: '/eventos' },
]

export default function Navbar() {
  const { user, logout } = useStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [areasAbierto, setAreasAbierto] = useState(false)
  const areasRef = useRef(null)
  const inicio = user ? '/inicio' : '/'

  useEffect(() => {
    setMenuAbierto(false)
    setAreasAbierto(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!areasAbierto) return undefined
    const fuera = (event) => {
      if (!areasRef.current?.contains(event.target)) setAreasAbierto(false)
    }
    const tecla = (event) => {
      if (event.key === 'Escape') setAreasAbierto(false)
    }
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

  function cerrarSesion() {
    cerrar()
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar" aria-label="Navegación principal">
      <div className="navbar__inner">
        <Link to={inicio} className="navbar__brand" onClick={cerrar}>
          <span className="navbar__mark" aria-hidden="true">UA</span>
          <span className="navbar__name">
            Uniautónoma
            <small>Bienestar Universitario</small>
          </span>
        </Link>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={menuAbierto}
          aria-controls="navbar-menu"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuAbierto((value) => !value)}
        >
          <span className="navbar__bars" aria-hidden="true" />
        </button>

        <div id="navbar-menu" className={`navbar__menu${menuAbierto ? ' is-open' : ''}`}>
          <ul className="navbar__links">
            {PRINCIPAL.map((item) => {
              const to = item.label === 'Inicio' ? inicio : item.to
              return (
                <li key={item.label}>
                  <NavLink
                    to={to}
                    end={item.end}
                    className={({ isActive }) => `navbar__link${isActive ? ' is-active' : ''}`}
                    onClick={cerrar}
                  >
                    {item.label}
                  </NavLink>
                </li>
              )
            })}

            <li className="navbar__areas" ref={areasRef}>
              <button
                type="button"
                className="navbar__link navbar__link--button"
                aria-expanded={areasAbierto}
                aria-controls="navbar-areas"
                onClick={() => setAreasAbierto((value) => !value)}
              >
                Áreas de bienestar
                <svg viewBox="0 0 12 12" width="13" height="13" aria-hidden="true">
                  <path
                    d="M2.5 4.5 6 8l3.5-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div id="navbar-areas" className={`navbar__panel${areasAbierto ? ' is-open' : ''}`}>
                <div className="navbar__panel-head">
                  <span>Explora bienestar</span>
                  <small>Áreas disponibles en el campus</small>
                </div>
                <ul className="navbar__panel-grid">
                  {MODULOS_PROXIMOS.map((area, index) => (
                    <li key={area.id}>
                      <NavLink className="navbar__area" to={`/areas/${area.id}`} onClick={cerrar}>
                        <span className="navbar__area-number">0{index + 1}</span>
                        <span className="navbar__area-copy">
                          <strong>{area.titulo}</strong>
                          <em>{area.estado}</em>
                        </span>
                        <span className="navbar__area-arrow" aria-hidden="true">→</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>

          <div className="navbar__session">
            {user ? (
              <>
                <Link className="navbar__user" to="/inicio" onClick={cerrar}>
                  <span>{user.nombre.split(' ')[0]}</span>
                  <small>Mi espacio</small>
                </Link>
                <button type="button" className="navbar__out" onClick={cerrarSesion}>
                  Salir
                </button>
              </>
            ) : (
              <Link className="navbar__login navbar__login--primary" to="/login" onClick={cerrar}>
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
