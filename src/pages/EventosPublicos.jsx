import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext.jsx'
import { formatFechaLarga } from '../components/home/formatters.js'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200'

function disponibles(evento) {
  return Math.max(0, evento.cupo - evento.inscritosIds.length)
}

export default function EventosPublicos() {
  const { user, eventos, inscribirEvento } = useStore()
  const [aviso, setAviso] = useState(null)
  const futuros = useMemo(
    () => [...eventos]
      .filter((evento) => evento.fecha >= new Date().toISOString().slice(0, 10))
      .sort((a, b) => a.fecha.localeCompare(b.fecha)),
    [eventos],
  )

  function participar(evento) {
    if (user?.rol !== 'estudiante') return
    const resultado = inscribirEvento(evento.id, user.id)
    setAviso({
      error: !resultado.ok,
      texto: resultado.ok
        ? `Tu participación en ${evento.nombre} quedó registrada.`
        : resultado.error,
    })
  }

  return (
    <div className="public-page">
      <section className="public-hero" aria-labelledby="eventos-publicos-title">
        <div className="public-hero__copy">
          <p className="public-hero__eyebrow">Agenda del campus</p>
          <h1 id="eventos-publicos-title">Encuentra tu próximo <em>espacio de encuentro.</em></h1>
          <p className="public-hero__lead">
            Torneos, bienestar y actividades abiertas para estudiantes, docentes y
            administración. Revisa la agenda y participates desde aquí.
          </p>
          <div className="public-hero__actions">
            <a className="btn gold" href="#agenda-publica">Ver agenda</a>
            {!user && <Link className="btn ghost" to="/login">Iniciar sesión</Link>}
          </div>
        </div>
        <aside className="public-hero__panel" aria-label="Resumen de eventos">
          <small>Próximas actividades</small>
          <div className="public-hero__stats">
            <div className="public-stat">
              <strong>{futuros.length}</strong>
              <span>eventos publicados</span>
            </div>
            <div className="public-stat">
              <strong>{futuros.reduce((total, evento) => total + disponibles(evento), 0)}</strong>
              <span>participaciones libres</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="public-page__section" id="agenda-publica" aria-labelledby="agenda-publica-title">
        <div className="home-section__head">
          <div>
            <h2 id="agenda-publica-title">Próximos eventos</h2>
            <p>Actividades programadas para la comunidad universitaria.</p>
          </div>
        </div>

        {futuros.length === 0 ? (
          <p className="public-empty">No hay eventos publicados por el momento.</p>
        ) : (
          <div className="public-events-grid">
            {futuros.map((evento) => {
              const lleno = disponibles(evento) === 0
              const inscrito = !!user && evento.inscritosIds.includes(user.id)
              const porcentaje = evento.cupo
                ? Math.min(100, Math.round((evento.inscritosIds.length / evento.cupo) * 100))
                : 0

              return (
                <article className="public-event-card" key={evento.id}>
                  <div
                    className="public-event-card__media"
                    style={{ backgroundImage: `url(${evento.imagen || FALLBACK_IMG})` }}
                    role="img"
                    aria-label={evento.nombre}
                  >
                    <span className="public-event-card__type">{evento.tipo}</span>
                  </div>
                  <div className="public-event-card__body">
                    <h2>{evento.nombre}</h2>
                    <p>{evento.descripcion}</p>
                    <div className="public-event-card__meta">
                      <span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
                          <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        {formatFechaLarga(evento.fecha)}
                      </span>
                      <span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" stroke="currentColor" strokeWidth="1.8" />
                          <circle cx="12" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                        {evento.lugar}
                      </span>
                    </div>
                    <div className="public-availability">
                      <div className="public-availability__label">
                        <span>{evento.inscritosIds.length} inscritos</span>
                        <span>{disponibles(evento)} cupos</span>
                      </div>
                      <div className="cupo-bar" aria-hidden="true">
                        <span style={{ width: `${porcentaje}%` }} />
                      </div>
                    </div>
                    <div className="home-actions">
                      {user?.rol === 'estudiante' && (
                        <button
                          className="btn primary"
                          disabled={lleno || inscrito}
                          onClick={() => participar(evento)}
                        >
                          {inscrito ? 'Ya participas' : lleno ? 'Sin cupo' : 'Participar'}
                        </button>
                      )}
                      {!user && !lleno && (
                        <Link className="btn primary" to={`/login?evento=${evento.id}`}>
                          Iniciar sesión y participar
                        </Link>
                      )}
                      {!user && lleno && <button className="btn ghost" disabled>Sin cupo</button>}
                      {user?.rol === 'admin' && (
                        <Link className="btn primary" to="/admin/eventos">Gestionar eventos</Link>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {aviso && (
        <div className={`public-notice${aviso.error ? ' is-error' : ''}`} role="status">
          <p>{aviso.texto}</p>
          <button type="button" onClick={() => setAviso(null)}>Cerrar</button>
        </div>
      )}
    </div>
  )
}
