import { Link } from 'react-router-dom'
import { etiquetaRol, saludoSegunHora } from './formatters.js'
import './HomeHeader.css'

export default function HomeHeader({ user, deportes = [] }) {
  const ahora = new Date()
  const diaSemana = ahora.toLocaleDateString('es-CO', { weekday: 'long' })
  const mes = ahora.toLocaleDateString('es-CO', { month: 'long' })
  const dia = ahora.getDate()
  const invitado = !user
  const rutaDeportes = user?.rol === 'estudiante' ? '/estudiante/catalogo' : '/deportes'

  return (
    <header className="home-header">
      <div className="home-header__body">
        <p className="home-header__eyebrow">Bienestar universitario</p>
        <h1>
          {invitado ? (
            <>Todo tu bienestar, <em>en un solo lugar.</em></>
          ) : (
            <>{saludoSegunHora()}, <em>{user.nombre.split(' ')[0]}.</em></>
          )}
        </h1>
        <p className="home-header__lead">
          {invitado
            ? 'Descubre deportes, participa en la agenda del campus y encuentra las áreas que te acompañarán durante tu vida universitaria.'
            : 'Continúa tus inscripciones, consulta tu agenda y descubre nuevas experiencias dentro del campus.'}
        </p>
        <div className="home-header__actions">
          <Link className="btn gold" to={rutaDeportes}>
            Explorar deportes
          </Link>
          {invitado ? (
            <Link className="btn ghost home-header__login" to="/eventos">
              Ver agenda del campus
            </Link>
          ) : (
            <Link className="btn ghost" to="/inicio">
              Ver mi resumen
            </Link>
          )}
        </div>
        <div className="home-header__promise" aria-label="Beneficios del portal">
          <span><i aria-hidden="true">✓</i> Inscripción en línea</span>
          <span><i aria-hidden="true">✓</i> Agenda actualizada</span>
          <span><i aria-hidden="true">✓</i> Horarios y sedes</span>
        </div>
      </div>

      <aside className="home-header__visual" aria-label={invitado ? 'Información del campus' : 'Sesión actual'}>
        <div className="home-header__visual-top">
          <span className="home-header__spark" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <path d="M24 5c1.7 10.1 8.9 17.3 19 19-10.1 1.7-17.3 8.9-19 19-1.7-10.1-8.9-17.3-19-19 10.1-1.7 17.3-8.9 19-19Z" fill="currentColor" />
            </svg>
          </span>
          <span>
            <small>{invitado ? 'Campus vivo' : etiquetaRol(user.rol)}</small>
            <strong>{invitado ? 'Experiencias para todos' : 'Sesión universitaria activa'}</strong>
          </span>
        </div>

        <time className="home-header__date" dateTime={ahora.toISOString()}>
          <span className="home-header__day">{String(dia).padStart(2, '0')}</span>
          <span className="home-header__month">
            <strong>{diaSemana}</strong>
            <small>{mes} · campus en movimiento</small>
          </span>
        </time>

        <div className="home-header__visual-bottom">
          <span><strong>{deportes.length}</strong> deportes disponibles</span>
          <span className="home-header__status"><i aria-hidden="true" /> Inscripciones abiertas</span>
        </div>
        {!invitado && (
          <small className="home-header__account">
            {user.categoria ? `Categoría ${user.categoria}` : user.correo}
          </small>
        )}
      </aside>
    </header>
  )
}
