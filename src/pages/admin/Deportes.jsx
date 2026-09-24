import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/StoreContext.jsx'

const empty = { nombre: '', descripcion: '', cupo: 20, categorias: [], imagen: '' }

export default function Deportes() {
  const { deportes, saveDeporte, deleteDeporte } = useStore()
  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})

  function toggleCat(cat) {
    setForm((f) => ({
      ...f,
      categorias: f.categorias.includes(cat) ? f.categorias.filter((c) => c !== cat) : [...f.categorias, cat],
    }))
  }

  function submit(e) {
    e.preventDefault()
    const err = {}
    if (!form.nombre.trim()) err.nombre = 'Nombre obligatorio'
    if (!form.descripcion.trim()) err.descripcion = 'Descripción obligatoria'
    if (!form.cupo || form.cupo < 1) err.cupo = 'Cupo inválido'
    if (form.categorias.length === 0) err.categorias = 'Elige al menos una categoría'
    setErrors(err)
    if (Object.keys(err).length) return
    saveDeporte(form)
    setForm(null)
  }

  return (
    <>
      <div className="topbar">
        <h1>Deportes</h1>
        <button className="btn gold" onClick={() => setForm({ ...empty })}>Nuevo deporte</button>
      </div>
      <div className="cards">
        {deportes.map((d) => (
          <article className="card" key={d.id}>
            {d.imagen && <img src={d.imagen} alt="" />}
            <div className="body">
              <h3>{d.nombre}</h3>
              <p>{d.descripcion}</p>
              <p><strong>{d.inscritosIds.length}/{d.cupo}</strong> cupos</p>
              {d.categorias.map((c) => <span className="chip" key={c}>{c}</span>)}
              <div className="row" style={{ marginTop: 10 }}>
                <Link className="btn primary" to={`/admin/deportes/${d.id}`}>Gestionar</Link>
                <button className="btn ghost" onClick={() => setForm({ ...d })}>Editar</button>
                <button className="btn danger" onClick={() => deleteDeporte(d.id)}>Eliminar</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {form && (
        <div className="modal-bg" onClick={() => setForm(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
            <h2>{form.id ? 'Editar deporte' : 'Crear deporte'}</h2>
            <label className="field"><span>Nombre</span>
              <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              {errors.nombre && <small className="err">{errors.nombre}</small>}
            </label>
            <label className="field"><span>Descripción</span>
              <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
              {errors.descripcion && <small className="err">{errors.descripcion}</small>}
            </label>
            <label className="field"><span>Cupo base</span>
              <input type="number" value={form.cupo} onChange={(e) => setForm({ ...form, cupo: Number(e.target.value) })} />
              {errors.cupo && <small className="err">{errors.cupo}</small>}
            </label>
            <label className="field"><span>Imagen (URL)</span>
              <input value={form.imagen || ''} onChange={(e) => setForm({ ...form, imagen: e.target.value })} />
            </label>
            <div className="field">
              <span>Categorías / restricciones</span>
              {['Pregrado', 'Postgrado', 'Egresado'].map((c) => (
                <label key={c}><input type="checkbox" checked={form.categorias.includes(c)} onChange={() => toggleCat(c)} /> {c}</label>
              ))}
              {errors.categorias && <small className="err">{errors.categorias}</small>}
            </div>
            <div className="row">
              <button className="btn primary" type="submit">Guardar</button>
              <button className="btn ghost" type="button" onClick={() => setForm(null)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
