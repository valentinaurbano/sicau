import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatFechaLarga } from './formatters.js'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?w=1200'

export default function EventsCarousel({ eventos, user, onParticipar }) {
  const destacados = useMemo(() => {
    const proximos = [...eventos].sort((a, b) => a.fecha.localeCompare(b.fecha))
    return proximos.slice(0, 4)
  }, [eventos])

  const [indice, setIndice] = useState(0)

  useEffect(() => {
    if (destacados.length < 2) return undefined
    const timer = setInterval(() => {
      setIndice((i) => (i + 1) % destacados.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [destacados.length])

  if (destacados.length === 0) {
    return (
      <section className="home-section">
        <h2>Agenda del campus</h2>
        <p>Aún no hay eventos publicados. Vuelve en unos días.</p>
      </section>
    )
  }

  const actual = destacados[Math.min(indice, destacados.length - 1)]
  const inscrito = actual.inscritosIds.includes(user.id)
  const lleno = actual.inscritosIds.length >= actual.cupo
  const esEstudiante = user.rol === 'estudiante'

  return (
    <section className="home-section" aria-labelledby="agenda-campus">
      <div className="home-section__head">
        <div>
          <h2 id="agenda-campus">Agenda del campus</h2>
          <p>Lo más cercano para toda la comunidad: estudiantes, docentes y administración.</p>
        </div>
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
            <span className="chip" style={{ background: 'rgba(245,165,36,.92)', color: '#1b1404' }}>
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
              {user.rol === 'admin' && (
                <Link className="btn gold" to="/admin/eventos">Gestionar eventos</Link>
              )}
              {user.rol === 'docente' && (
                <span className="chip">Visible para tu rol · inscripción de estudiantes</span>
              )}
            </div>
          </div>
        </article>

        <div className="events-rail" role="tablist" aria-label="Elegir evento">
          {destacados.map((ev, i) => (
            <button
              key={ev.id}
              type="button"
              role="tab"
              aria-selected={i === indice}
              className={`event-thumb ${i === indice ? 'is-active' : ''}`}
              onClick={() => setIndice(i)}
            >
              <strong>{ev.nombre}</strong>
              <span>{formatFechaLarga(ev.fecha)} · {ev.lugar}</span>
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
            onClick={() => setIndice((i) => (i - 1 + destacados.length) % destacados.length)}
          >
            ←
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="Evento siguiente"
            onClick={() => setIndice((i) => (i + 1) % destacados.length)}
          >
            →
          </button>
        </div>
      )}
    </section>
  )
}
