import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../../store/StoreContext.jsx'

export default function DeporteDetalle() {
  const { id } = useParams()
  const { deportes, users, addHorario, asignarDocente, inscribir, retirar } = useStore()
  const deporte = deportes.find((d) => d.id === id)
  const docentes = users.filter((u) => u.rol === 'docente')
  const estudiantes = users.filter((u) => u.rol === 'estudiante')
  const [horario, setHorario] = useState({ dia: 'Lunes', inicio: '16:00', fin: '18:00', lugar: '' })
  const [msg, setMsg] = useState('')
  const [q, setQ] = useState('')

  if (!deporte) return <p>Deporte no encontrado. <Link to="/admin/deportes">Volver</Link></p>

  function onHorario(e) {
    e.preventDefault()
    const res = addHorario(deporte.id, horario)
    setMsg(res.ok ? 'Horario añadido' : res.error)
  }

  function forzar() {
    const est = estudiantes.find(
      (e) => e.correo.toLowerCase().includes(q.toLowerCase()) || e.documento?.includes(q) || e.nombre.toLowerCase().includes(q.toLowerCase()),
    )
    if (!est) return setMsg('Estudiante no encontrado')
    const res = inscribir(deporte.id, est.id, { forzar: true })
    setMsg(res.ok ? `Inscrito ${est.nombre} (sin validar cupo)` : res.error)
  }

  return (
    <>
      <p><Link to="/admin/deportes">← Deportes</Link></p>
      <h1>{deporte.nombre}</h1>
      <p>{deporte.descripcion}</p>
      {msg && <p><strong>{msg}</strong></p>}

      <h2>Horarios</h2>
      <table className="table">
        <thead><tr><th>Día</th><th>Bloque</th><th>Lugar</th><th>Docente</th></tr></thead>
        <tbody>
          {deporte.horarios.map((h) => (
            <tr key={h.id}>
              <td>{h.dia}</td>
              <td>{h.inicio}–{h.fin}</td>
              <td>{h.lugar}</td>
              <td>
                <select
                  value={h.docenteId || ''}
                  onChange={(e) => {
                    const r = asignarDocente(deporte.id, h.id, e.target.value)
                    if (!r.ok) setMsg(r.error)
                  }}
                >
                  <option value="">Asignar docente</option>
                  {docentes.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form className="row" onSubmit={onHorario} style={{ margin: '12px 0 24px' }}>
        <select value={horario.dia} onChange={(e) => setHorario({ ...horario, dia: e.target.value })}>
          {['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'].map((d) => <option key={d}>{d}</option>)}
        </select>
        <input type="time" value={horario.inicio} onChange={(e) => setHorario({ ...horario, inicio: e.target.value })} />
        <input type="time" value={horario.fin} onChange={(e) => setHorario({ ...horario, fin: e.target.value })} />
        <input placeholder="Lugar" value={horario.lugar} onChange={(e) => setHorario({ ...horario, lugar: e.target.value })} required />
        <button className="btn primary" type="submit">Añadir horario</button>
      </form>

      <h2>Inscritos ({deporte.inscritosIds.length}/{deporte.cupo})</h2>
      <table className="table">
        <thead><tr><th>Nombre</th><th>Categoría</th><th></th></tr></thead>
        <tbody>
          {deporte.inscritosIds.map((eid) => {
            const e = users.find((u) => u.id === eid)
            return (
              <tr key={eid}>
                <td>{e?.nombre}</td>
                <td>{e?.categoria}</td>
                <td><button className="btn danger" onClick={() => retirar(deporte.id, eid, { admin: true })}>Retirar</button></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="row" style={{ marginTop: 12 }}>
        <input className="search" placeholder="Correo @uniautonoma.edu.co, nombre o documento" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn gold" onClick={forzar}>Forzar inscripción</button>
      </div>
    </>
  )
}
