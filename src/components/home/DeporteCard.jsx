import { Link } from 'react-router-dom'

function cupoPct(deporte) {
  if (!deporte.cupo) return 0
  return Math.min(100, Math.round((deporte.inscritosIds.length / deporte.cupo) * 100))
}

export default function DeporteCard({ deporte, users, user, compact, onInscribir }) {
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
