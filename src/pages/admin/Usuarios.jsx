import { useState } from 'react'
import { useStore } from '../../store/StoreContext.jsx'
import { emailDomainError, isInstitutionalEmail } from '../../utils/email.js'

export default function Usuarios() {
  const { users, deportes, saveUser, importDocentesCsv } = useStore()
  const [tab, setTab] = useState('estudiante')
  const [form, setForm] = useState(null)
  const [q, setQ] = useState('')
  const [ficha, setFicha] = useState(null)
  const [err, setErr] = useState('')

  const list = users.filter((u) => u.rol === tab && (
    !q || u.nombre.toLowerCase().includes(q.toLowerCase()) || u.documento?.includes(q) || u.correo.toLowerCase().includes(q.toLowerCase())
  ))

  function submit(e) {
    e.preventDefault()
    if (!isInstitutionalEmail(form.correo)) {
      setErr(emailDomainError())
      return
    }
    const res = saveUser({ ...form, rol: tab })
    if (!res.ok) setErr(res.error)
    else { setForm(null); setErr('') }
  }

  return (
    <>
      <div className="topbar">
        <h1>Usuarios</h1>
        <div className="row">
          {['admin', 'docente', 'estudiante'].map((t) => (
            <button key={t} className={`btn ${tab === t ? 'primary' : 'ghost'}`} onClick={() => setTab(t)}>{t}s</button>
          ))}
        </div>
      </div>
      <div className="row" style={{ marginBottom: 12 }}>
        <input className="search" placeholder="Buscar nombre o documento" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn gold" onClick={() => setForm({ nombre: '', correo: '', especialidad: '', categoria: 'Pregrado', documento: '' })}>
          Nuevo {tab}
        </button>
      </div>
      {tab === 'docente' && (
        <label className="field">
          <span>Carga masiva CSV (nombre,correo@uniautonoma.edu.co,especialidad)</span>
          <input type="file" accept=".csv" onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const reader = new FileReader()
            reader.onload = () => importDocentesCsv(String(reader.result))
            reader.readAsText(file)
          }} />
        </label>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th><th>Correo</th>
            <th>{tab === 'estudiante' ? 'Categoría' : 'Especialidad'}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {list.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.categoria || u.especialidad || '—'}</td>
              <td className="row">
                {tab === 'estudiante' && <button className="btn ghost" onClick={() => setFicha(u)}>Ficha</button>}
                {tab === 'estudiante' && (
                  <select value={u.categoria} onChange={(e) => saveUser({ ...u, categoria: e.target.value })}>
                    <option>Pregrado</option><option>Postgrado</option><option>Egresado</option>
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {form && (
        <div className="modal-bg" onClick={() => setForm(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
            <h2>Nuevo {tab}</h2>
            {err && <p className="err">{err}</p>}
            <label className="field"><span>Nombre</span><input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></label>
            <label className="field">
              <span>Correo institucional</span>
              <input
                required
                type="email"
                placeholder="usuario@uniautonoma.edu.co"
                pattern="^[a-zA-Z0-9._%+-]+@uniautonoma\.edu\.co$"
                title="Usa un correo institucional @uniautonoma.edu.co"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
              />
              <small className="hint">Solo @uniautonoma.edu.co</small>
            </label>
            {tab === 'docente' && <label className="field"><span>Especialidad</span><input value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })} /></label>}
            {tab === 'estudiante' && (
              <>
                <label className="field"><span>Documento</span><input value={form.documento} onChange={(e) => setForm({ ...form, documento: e.target.value })} /></label>
                <label className="field"><span>Categoría</span>
                  <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                    <option>Pregrado</option><option>Postgrado</option><option>Egresado</option>
                  </select>
                </label>
              </>
            )}
            <button className="btn primary" type="submit">Guardar</button>
          </form>
        </div>
      )}

      {ficha && (
        <div className="modal-bg" onClick={() => setFicha(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{ficha.nombre}</h2>
            <p>{ficha.correo} · {ficha.categoria} · {ficha.documento}</p>
            <h3>Inscripciones</h3>
            <ul>
              {deportes.filter((d) => d.inscritosIds.includes(ficha.id)).map((d) => <li key={d.id}>{d.nombre}</li>)}
              {deportes.every((d) => !d.inscritosIds.includes(ficha.id)) && <li>Sin inscripciones</li>}
            </ul>
            <button className="btn ghost" onClick={() => setFicha(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  )
}
