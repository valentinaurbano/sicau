import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatFechaLarga } from './formatters.js'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?w=1200'

export default function EventsCarousel({ eventos, user, onParticipar }) {
  const destacados = useMemo(() => {
    const hoy = new Date().toISOString().slice(0, 10)
    return [...eventos]
      .filter((evento) => evento.fecha >= hoy)
      .sort((a, b) => a.fecha.localeCompare(b.fecha))
      .slice(0, 4)
  }, [eventos])

  const [indice, setIndice] = useState(0)

  useEffect(() => {
    if (destacados.length < 2) return undefined
    const timer = setInterval(() => {
      setIndice((current) => (current + 1) % destacados.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [destacados.length])

  if (destacados.length === 0) {
    return (
      <section className="home-section">
        <div className="home-section__head">
          <div>
            <h2>Agenda del campus</h2>
            <p>Aún no hay eventos publicados. Vuelve pronto para conocer las próximas actividades.</p>
          </div>
        </div>
      </section>
    )
  }

  const actual = destacados[Math.min(indice, destacados.length - 1)]
  const inscrito = !!user && actual.inscritosIds.includes(user.id)
  const lleno = actual.inscritosIds.length >= actual.cupo
  const esEstudiante = user?.rol === 'estudiante'
  const agendaUrl = !user
    ? '/eventos'
    : esEstudiante
      ? '/estudiante/eventos'
      : user?.rol === 'admin'
        ? '/admin/eventos'
        : '/docente'

  return (
    <section className="home-section" aria-labelledby="agenda-campus">
      <div className="home-section__head">
        <div>
          <span className="home-section__eyebrow">Agenda del campus</span>
          <h2 id="agenda-campus">Lo que viene para ti</h2>
          <p>Encuentros, torneos y actividades que hacen parte de la vida universitaria.</p>
        </div>
        <Link className="btn ghost" to={agendaUrl}>Ver agenda completa</Link>
      </div>

      <div className="events-stage">
        <article className="event-hero">
          <div
            className="event-hero__media"
            style={{ backgroundImage: `url(${actual.imagen || FALLBACK_IMG})` }}
            role="img"
            aria-label={actual.nombre}
          />
          <div className="event-hero__body">
            <span className="chip" style={{ background: 'var(--orange)', color: '#1b1404' }}>
              {actual.tipo}
            </span>
            <h3>{actual.nombre}</h3>
            {actual.descripcion && <p>{actual.descripcion}</p>}
            <div className="event-meta">
              <span>{formatFechaLarga(actual.fecha)}</span>
              <span>· {actual.lugar}</span>
              <span>· {actual.inscritosIds.length}/{actual.cupo} cupos</span>
            </div>
            <div className="home-actions">
              {esEstudiante && (
                <button
                  className="btn gold"
                  disabled={inscrito || lleno}
                  onClick={() => onParticipar(actual)}
                >
                  {inscrito ? 'Ya participas' : lleno ? 'Sin cupo' : 'Quiero participar'}
                </button>
              )}
              {!user && !lleno && (
                <Link className="btn gold" to={`/login?evento=${actual.id}`}>
                  Participar en el evento
                </Link>
              )}
              {!user && lleno && <button className="btn ghost" disabled>Sin cupo</button>}
              {user?.rol === 'admin' && (
                <Link className="btn gold" to="/admin/eventos">Gestionar eventos</Link>
              )}
              {user?.rol === 'docente' && (
                <Link className="btn gold" to="/docente">Ver mi agenda de hoy</Link>
              )}
            </div>
          </div>
        </article>

        <div className="events-rail" role="tablist" aria-label="Elegir evento">
          {destacados.map((evento, eventIndex) => (
            <button
              key={evento.id}
              type="button"
              role="tab"
              aria-selected={eventIndex === indice}
              className={`event-thumb ${eventIndex === indice ? 'is-active' : ''}`}
              onClick={() => setIndice(eventIndex)}
            >
              <strong>{evento.nombre}</strong>
              <span>{formatFechaLarga(evento.fecha)} · {evento.lugar}</span>
            </button>
          ))}
        </div>
      </div>

      {destacados.length > 1 && (
        <div className="event-controls">
          <button
            type="button"
            className="icon-btn"
            aria-label="Evento anterior"
            onClick={() => setIndice((current) => (current - 1 + destacados.length) % destacados.length)}
          >
            ←
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="Evento siguiente"
            onClick={() => setIndice((current) => (current + 1) % destacados.length)}
          >
            →
          </button>
        </div>
      )}
    </section>
  )
}
