import { Link } from 'react-router-dom'
import { useStore } from '../../store/StoreContext.jsx'

export default function HistorialAsistencia() {
  const { user, deportes, asistencias, users } = useStore()
  const mine = asistencias.filter((a) => deportes.find((d) => d.id === a.deporteId)?.horarios.some((h) => h.docenteId === user.id))

  return (
    <>
      <h1>Historial de asistencias</h1>
      {mine.length === 0 && <p>Aún no hay registros.</p>}
      {mine.map((a) => {
        const d = deportes.find((x) => x.id === a.deporteId)
        const horas = (Date.now() - new Date(a.createdAt).getTime()) / 36e5
        return (
          <div className="card" key={a.id} style={{ marginBottom: 12 }}>
            <div className="body">
              <h3>{d?.nombre} · {a.fecha}</h3>
              <p>{a.registros.filter((r) => r.presente).length}/{a.registros.length} presentes</p>
              <ul>
                {a.registros.map((r) => (
                  <li key={r.estudianteId}>{users.find((u) => u.id === r.estudianteId)?.nombre}: {r.presente ? 'Presente' : 'Falta'}</li>
                ))}
              </ul>
              {horas <= 24 ? (
                <Link className="btn ghost" to={`/docente/grupos/${a.deporteId}/asistencia`}>Editar (menos de 24 h)</Link>
              ) : (
                <p className="err">Bloqueado: pasaron más de 24 horas</p>
              )}
            </div>
          </div>
        )
      })}
    </>
  )
}
