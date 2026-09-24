import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useStore } from '../../store/StoreContext.jsx'

export default function Asistencia() {
  const { id } = useParams()
  const { user, users, deportes, asistencias, guardarAsistencia } = useStore()
  const deporte = deportes.find((d) => d.id === id)
  const fecha = new Date().toISOString().slice(0, 10)
  const previa = asistencias.find((a) => a.deporteId === id && a.fecha === fecha)

  const inicial = useMemo(() => {
    const map = {}
    deporte?.inscritosIds.forEach((eid) => {
      map[eid] = previa?.registros.find((r) => r.estudianteId === eid)?.presente ?? false
    })
    return map
  }, [deporte, previa])

  const [checks, setChecks] = useState(inicial)
  const [msg, setMsg] = useState('')

  if (!deporte) return <p>No encontrado</p>
  if (!deporte.horarios.some((h) => h.docenteId === user.id)) return <Navigate to="/docente" replace />

  function enviar() {
    const registros = deporte.inscritosIds.map((estudianteId) => ({ estudianteId, presente: !!checks[estudianteId] }))
    const res = guardarAsistencia(deporte.id, fecha, registros)
    setMsg(res.ok ? 'Asistencia guardada' : res.error)
  }

  return (
    <>
      <p><Link to={`/docente/grupos/${id}`}>← Grupo</Link></p>
      <h1>Asistencia · {deporte.nombre}</h1>
      <p>{fecha}</p>
      {msg && <p><strong>{msg}</strong></p>}
      <button className="btn ghost" onClick={() => {
        const all = {}
        deporte.inscritosIds.forEach((eid) => { all[eid] = true })
        setChecks(all)
      }}>Marcar a todos presentes</button>
      <table className="table" style={{ marginTop: 12 }}>
        <thead><tr><th>Estudiante</th><th>Presente</th></tr></thead>
        <tbody>
          {deporte.inscritosIds.map((eid) => {
            const e = users.find((u) => u.id === eid)
            return (
              <tr key={eid}>
                <td>{e?.nombre}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={!!checks[eid]}
                    onChange={(ev) => setChecks({ ...checks, [eid]: ev.target.checked })}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <button className="btn primary" onClick={enviar} style={{ marginTop: 12 }}>Finalizar y enviar</button>
    </>
  )
}
