import { etiquetaRol, saludoSegunHora } from './formatters.js'

export default function HomeHeader({ user }) {
  const ahora = new Date()
  const fechaStamp = ahora.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <header className="home-header">
      <div>
        <p className="home-header__eyebrow">Bienestar universitario</p>
        <h1>
          {saludoSegunHora()}, <em>{user.nombre.split(' ')[0]}</em>
        </h1>
        <p className="home-header__lead">
          Esta es la casa común del campus: eventos abiertos a toda la comunidad y el
          módulo de Deportes ya en marcha. El resto de áreas se irán abriendo sin
          perder el hilo de lo que ya funciona.
        </p>
      </div>
      <aside className="home-header__stamp" aria-label="Sesión actual">
        <small>{etiquetaRol(user.rol)}</small>
        <strong>{fechaStamp}</strong>
        <small>{user.categoria ? `Categoría ${user.categoria}` : user.correo}</small>
      </aside>
    </header>
  )
}
