import { Link } from 'react-router-dom'
import { etiquetaRol, saludoSegunHora } from './formatters.js'
import './HomeHeader.css'

export default function HomeHeader({ user }) {
  const ahora = new Date()
  const diaSemana = ahora.toLocaleDateString('es-CO', { weekday: 'long' })
  const mes = ahora.toLocaleDateString('es-CO', { month: 'long' })
  const dia = ahora.getDate()
  const invitado = !user

  return (
    <header className="home-header">
      <div className="home-header__body">
        <p className="home-header__eyebrow">Bienestar universitario</p>
        <h1>
          {invitado ? (
            <>Hola, <em>bienvenido al campus</em></>
          ) : (
            <>
              {saludoSegunHora()}, <em>{user.nombre.split(' ')[0]}</em>
            </>
          )}
        </h1>
        <p className="home-header__lead">
          Esta es la casa común del campus: eventos abiertos a toda la comunidad y el
          módulo de Deportes ya en marcha. El resto de áreas se irán abriendo sin
          perder el hilo de lo que ya funciona.
        </p>
      </div>

      <aside className="home-header__stamp" aria-label={invitado ? 'Acceso' : 'Sesión actual'}>
        <small>{invitado ? 'Acceso institucional' : etiquetaRol(user.rol)}</small>

        <time className="home-header__date" dateTime={ahora.toISOString()}>
          <span className="home-header__day">{dia}</span>
          <span className="home-header__month">
            <span>{diaSemana}</span>
            <span>{mes}</span>
          </span>
        </time>

        {invitado ? (
          <Link className="btn gold home-header__login" to="/login">
            Iniciar sesión
          </Link>
        ) : (
          <small>{user.categoria ? `Categoría ${user.categoria}` : user.correo}</small>
        )}
      </aside>
    </header>
  )
}