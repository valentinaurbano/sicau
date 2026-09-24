import { Link, Navigate, useParams } from 'react-router-dom'
import { useStore } from '../../store/StoreContext.jsx'

export default function Grupo() {
  const { id } = useParams()
  const { user, users, deportes } = useStore()
  const deporte = deportes.find((d) => d.id === id)
  if (!deporte) return <p>No encontrado</p>
  const asignado = deporte.horarios.some((h) => h.docenteId === user.id)
  if (!asignado) return <Navigate to="/docente" replace />

  return (
    <>
      <p><Link to="/docente">← Hoy</Link></p>
      <h1>{deporte.nombre}</h1>
      <p>Lista de inscritos</p>
      <table className="table">
        <thead><tr><th>Nombre</th><th>Documento</th><th>Categoría</th></tr></thead>
        <tbody>
          {deporte.inscritosIds.map((eid) => {
            const e = users.find((u) => u.id === eid)
            return (
              <tr key={eid}>
                <td>{e?.nombre}</td>
                <td>{e?.documento}</td>
                <td>{e?.categoria}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <Link className="btn gold" to={`/docente/grupos/${id}/asistencia`} style={{ marginTop: 16, display: 'inline-flex' }}>
        Tomar asistencia
      </Link>
    </>
  )
}
