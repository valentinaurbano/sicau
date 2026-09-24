import { useState } from 'react'
import { useStore } from '../../store/StoreContext.jsx'

export default function Catalogo() {
  const { user, deportes, inscribir } = useStore()
  const [q, setQ] = useState('')
  const [dia, setDia] = useState('')
  const [error, setError] = useState(null)
  const [ok, setOk] = useState('')

  const list = deportes.filter((d) => {
    const matchName = d.nombre.toLowerCase().includes(q.toLowerCase())
    const matchDia = !dia || d.horarios.some((h) => h.dia === dia)
    return matchName && matchDia
  })

  return (
    <>
      <div className="topbar">
        <h1>Catálogo de deportes</h1>
      </div>
      <div className="row" style={{ marginBottom: 16 }}>
        <input className="search" placeholder="Buscar por nombre" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={dia} onChange={(e) => setDia(e.target.value)}>
          <option value="">Todos los días</option>
          {['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'].map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>
      <div className="cards">
        {list.map((d) => {
          const lleno = d.inscritosIds.length >= d.cupo
          const inscrito = d.inscritosIds.includes(user.id)
          return (
            <article className="card" key={d.id}>
              {d.imagen && <img src={d.imagen} alt="" />}
              <div className="body">
                <h3>{d.nombre}</h3>
                <p>{d.descripcion}</p>
                <p><strong>{d.inscritosIds.length}/{d.cupo}</strong> cupos</p>
                {d.horarios.map((h) => <div key={h.id} className="chip">{h.dia} {h.inicio}–{h.fin} · {h.lugar}</div>)}
                <div>{d.categorias.map((c) => <span className="chip" key={c}>{c}</span>)}</div>
                <button
                  className="btn primary"
                  disabled={lleno || inscrito}
                  onClick={() => {
                    const res = inscribir(d.id, user.id)
                    if (!res.ok) setError(res.error)
                    else setOk(`Inscripción exitosa en ${d.nombre}`)
                  }}
                >
                  {inscrito ? 'Ya inscrito' : lleno ? 'Sin cupo' : 'Inscribirme'}
                </button>
              </div>
            </article>
          )
        })}
      </div>
      {error && (
        <div className="modal-bg" onClick={() => setError(null)}>
          <div className="modal danger-box" onClick={(e) => e.stopPropagation()}>
            <h2>No se pudo inscribir</h2>
            <p>{error}</p>
            <button className="btn danger" onClick={() => setError(null)}>Entendido</button>
          </div>
        </div>
      )}
      {ok && (
        <div className="modal-bg" onClick={() => setOk('')}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>{ok}</p>
            <button className="btn primary" onClick={() => setOk('')}>Ok</button>
          </div>
        </div>
      )}
    </>
  )
}
