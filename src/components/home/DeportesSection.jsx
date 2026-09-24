import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

function cupoPct(deporte) {
  if (!deporte.cupo) return 0
  return Math.min(100, Math.round((deporte.inscritosIds.length / deporte.cupo) * 100))
}

function DeporteCard({ deporte, users, user, compact, onInscribir }) {
  const lleno = deporte.inscritosIds.length >= deporte.cupo
  const inscrito = deporte.inscritosIds.includes(user.id)
  const enseña = deporte.horarios.some((h) => h.docenteId === user.id)

  return (
    <article className={compact ? 'deporte-card' : 'deporte-destacado'}>
      {deporte.imagen && <img src={deporte.imagen} alt="" />}
      <div className={compact ? 'body' : 'deporte-destacado__copy'}>
        {!compact && <span className="chip">Destacado de la semana</span>}
        <h3>{deporte.nombre}</h3>
        <p>{deporte.descripcion}</p>
        <div className="cupo-bar" aria-hidden="true">
          <span style={{ width: `${cupoPct(deporte)}%` }} />
        </div>
        <small>{deporte.inscritosIds.length}/{deporte.cupo} cupos · {deporte.categorias.join(', ')}</small>
        <div className="horario-list">
          {deporte.horarios.map((h) => {
            const docente = users.find((u) => u.id === h.docenteId)
            return (
              <span className="chip" key={h.id}>
                {h.dia} {h.inicio}–{h.fin} · {h.lugar}
                {docente ? ` · ${docente.nombre}` : ''}
              </span>
            )
          })}
        </div>
        <div className="home-actions">
          {user.rol === 'estudiante' && (
            <button
              className="btn primary"
              disabled={lleno || inscrito}
              onClick={() => onInscribir(deporte)}
            >
              {inscrito ? 'Ya inscrito' : lleno ? 'Sin cupo' : 'Inscribirme'}
            </button>
          )}
          {user.rol === 'docente' && enseña && (
            <Link className="btn primary" to={`/docente/grupos/${deporte.id}`}>Ver mi grupo</Link>
          )}
          {user.rol === 'docente' && !enseña && (
            <span className="chip">Oferta abierta al campus</span>
          )}
          {user.rol === 'admin' && (
            <Link className="btn primary" to={`/admin/deportes/${deporte.id}`}>Gestionar disciplina</Link>
          )}
        </div>
      </div>
    </article>
  )
}

export default function DeportesSection({ deportes, users, user, onInscribir }) {
  const [disciplina, setDisciplina] = useState('Todas')

  const nombres = useMemo(
    () => ['Todas', ...deportes.map((d) => d.nombre)],
    [deportes],
  )

  const filtrados = useMemo(
    () => (disciplina === 'Todas' ? deportes : deportes.filter((d) => d.nombre === disciplina)),
    [deportes, disciplina],
  )

  // El destacado es el que todavía tiene más aire en el cupo.
  const destacado = useMemo(() => {
    if (filtrados.length === 0) return null
    return [...filtrados].sort(
      (a, b) => (b.cupo - b.inscritosIds.length) - (a.cupo - a.inscritosIds.length),
    )[0]
  }, [filtrados])

  const resto = filtrados.filter((d) => d.id !== destacado?.id)

  return (
    <section className="home-section" aria-labelledby="modulo-deportes">
      <div className="deportes-band">
        <div className="home-section__head">
          <div>
            <h2 id="modulo-deportes">Deportes</h2>
            <p>Disciplinas, horarios reales e inscripción según tu rol. Este módulo sí está vivo.</p>
          </div>
          {user.rol === 'estudiante' && (
            <Link className="btn ghost" to="/estudiante/catalogo">Catálogo completo</Link>
          )}
          {user.rol === 'admin' && (
            <Link className="btn ghost" to="/admin/deportes">Panel de deportes</Link>
          )}
        </div>

        <div className="disciplina-row" role="tablist" aria-label="Filtrar disciplinas">
          {nombres.map((nombre) => (
            <button
              key={nombre}
              type="button"
              className={`disciplina ${disciplina === nombre ? 'is-on' : ''}`}
              onClick={() => setDisciplina(nombre)}
            >
              {nombre}
            </button>
          ))}
        </div>

        {destacado && (
          <DeporteCard
            deporte={destacado}
            users={users}
            user={user}
            onInscribir={onInscribir}
          />
        )}

        {resto.length > 0 && (
          <div className="deporte-grid">
            {resto.map((deporte) => (
              <DeporteCard
                key={deporte.id}
                compact
                deporte={deporte}
                users={users}
                user={user}
                onInscribir={onInscribir}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
