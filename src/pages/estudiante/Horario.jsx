import { Link } from 'react-router-dom'
import { useStore } from '../../store/StoreContext.jsx'

const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export default function Horario() {
  const { user, deportes, asistencias } = useStore()
  const mine = deportes.filter((d) => d.inscritosIds.includes(user.id))
  const fallas = asistencias.reduce((n, a) => {
    const r = a.registros.find((x) => x.estudianteId === user.id)
    return n + (r && !r.presente ? 1 : 0)
  }, 0)

  if (mine.length === 0) {
    return (
      <>
        <h1>Mi horario</h1>
        <p>No tienes deportes inscritos.</p>
        <Link className="btn gold" to="/estudiante/catalogo">Ver catálogo</Link>
      </>
    )
  }

  return (
    <>
      <div className="topbar">
        <h1>Mi horario y perfil deportivo</h1>
        <div className="kpi">Fallas: <strong>{fallas}</strong></div>
      </div>
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
    </>
  )
}
