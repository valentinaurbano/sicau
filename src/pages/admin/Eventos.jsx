import { useState } from 'react'
import { useStore } from '../../store/StoreContext.jsx'

const empty = { nombre: '', fecha: '', lugar: '', tipo: 'Torneo', cupo: 20 }

export default function Eventos() {
  const { eventos, saveEvento } = useStore()
  const [form, setForm] = useState(null)

  function submit(e) {
    e.preventDefault()
    if (!form.nombre || !form.fecha || !form.lugar) return
    saveEvento(form)
    setForm(null)
  }

  return (
    <>
      <div className="topbar">
        <h1>Eventos</h1>
        <button className="btn gold" onClick={() => setForm({ ...empty })}>Nuevo evento</button>
      </div>
      <table className="table">
        <thead><tr><th>Nombre</th><th>Fecha</th><th>Lugar</th><th>Tipo</th><th>Cupos</th><th></th></tr></thead>
        <tbody>
          {eventos.map((ev) => (
            <tr key={ev.id}>
              <td>{ev.nombre}</td>
              <td>{ev.fecha}</td>
              <td>{ev.lugar}</td>
              <td>{ev.tipo}</td>
              <td>{ev.inscritosIds.length}/{ev.cupo}</td>
              <td><button className="btn ghost" onClick={() => setForm({ ...ev })}>Editar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {form && (
        <div className="modal-bg" onClick={() => setForm(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
            <h2>{form.id ? 'Editar evento' : 'Nuevo evento'}</h2>
            <label className="field"><span>Nombre</span><input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></label>
            <label className="field"><span>Fecha</span><input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} /></label>
            <label className="field"><span>Lugar</span><input value={form.lugar} onChange={(e) => setForm({ ...form, lugar: e.target.value })} /></label>
            <label className="field"><span>Tipo</span>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                <option>Torneo</option><option>Masterclass</option><option>Otro</option>
              </select>
            </label>
            <label className="field"><span>Cupo</span><input type="number" value={form.cupo} onChange={(e) => setForm({ ...form, cupo: Number(e.target.value) })} /></label>
            <button className="btn primary" type="submit">Guardar</button>
          </form>
        </div>
      )}
    </>
  )
}
