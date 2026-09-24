import { Link } from 'react-router-dom'

const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export default function EstudianteResumen({ user, deportes, asistencias }) {
  const mine = deportes.filter((d) => d.inscritosIds.includes(user.id))
  const inasistencias = asistencias.flatMap((a) => {
    const r = a.registros.find((x) => x.estudianteId === user.id)
    if (!r || r.presente) return []
    const deporte = deportes.find((d) => d.id === a.deporteId)
    return [{ id: a.id, fecha: a.fecha, deporte: deporte?.nombre || 'Deporte' }]
  })

  return (
    <section className="home-section" aria-labelledby="mi-espacio">
      <div className="home-section__head">
        <div>
          <h2 id="mi-espacio">Tu espacio deportivo</h2>
          <p>Horarios personales e inasistencias. La oferta del campus sigue arriba, igual que para todo el mundo.</p>
        </div>
        <Link className="btn ghost" to="/estudiante/horario">Ver horario completo</Link>
      </div>

      <div className="estudiante-resumen">
        <div className="kpi">
          <small>Inasistencias</small>
          <h2>{inasistencias.length}</h2>
        </div>
        <div className="kpi">
          <small>Deportes inscritos</small>
          <h2>{mine.length}</h2>
        </div>
      </div>

      {mine.length === 0 ? (
        <p>Aún no tienes horarios personales. Inscríbete en Deportes cuando quieras un cupo.</p>
      ) : (
        <div className="week">
          {dias.map((dia) => (
            <div className="day-col" key={dia}>
              <strong>{dia}</strong>
              {mine.flatMap((d) => d.horarios.filter((h) => h.dia === dia).map((h) => (
                <div className="slot" key={h.id}>
                  {d.nombre}<br />{h.inicio}–{h.fin}<br />{h.lugar}
                </div>
              )))}
            </div>
          ))}
        </div>
      )}

      {inasistencias.length > 0 && (
        <ul className="inasistencias-list">
          {inasistencias.map((item) => (
            <li key={item.id}>
              <strong>{item.deporte}</strong> · {item.fecha}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
