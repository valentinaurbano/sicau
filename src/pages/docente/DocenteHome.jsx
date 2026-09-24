import { Link } from 'react-router-dom'
import { useStore } from '../../store/StoreContext.jsx'

const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default function DocenteHome() {
  const { user, deportes } = useStore()
  const hoy = dias[new Date().getDay()]
  const clases = deportes.flatMap((d) =>
    d.horarios
      .filter((h) => h.docenteId === user.id)
      .map((h) => ({ ...h, deporte: d, esHoy: h.dia === hoy })),
  )
  const deHoy = clases.filter((c) => c.esHoy)

  return (
    <>
      <h1>Mis clases de hoy</h1>
      <p>{hoy}</p>
      {deHoy.length === 0 && <p>No tienes clases programadas para hoy.</p>}
      <div className="cards">
        {deHoy.map((c) => (
          <article className="card" key={c.id}>
            <div className="body">
              <h3>{c.deporte.nombre}</h3>
              <p>{c.inicio}–{c.fin} · {c.lugar}</p>
              <p>{c.deporte.inscritosIds.length} inscritos</p>
              <Link className="btn primary" to={`/docente/grupos/${c.deporte.id}`}>Ver grupo</Link>
            </div>
          </article>
        ))}
      </div>
      <h2 style={{ marginTop: 28 }}>Todos mis grupos</h2>
      <ul>
        {clases.map((c) => (
          <li key={c.id}>
            <Link to={`/docente/grupos/${c.deporte.id}`}>{c.deporte.nombre}</Link> · {c.dia} {c.inicio}
          </li>
        ))}
      </ul>
    </>
  )
}
