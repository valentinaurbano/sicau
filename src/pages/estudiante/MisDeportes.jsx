import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/StoreContext.jsx'

export default function MisDeportes() {
  const { user, deportes, retirar, periodoCerrado } = useStore()
  const mine = deportes.filter((d) => d.inscritosIds.includes(user.id))
  const [target, setTarget] = useState(null)
  const [msg, setMsg] = useState('')

  return (
    <>
      <h1>Mis deportes</h1>
      {msg && <p>{msg}</p>}
      {mine.length === 0 && (
        <p>Aún no estás inscrito. <Link to="/estudiante/catalogo">Ir al catálogo</Link></p>
      )}
      <div className="cards">
        {mine.map((d) => (
          <article className="card" key={d.id}>
            <div className="body">
              <h3>{d.nombre}</h3>
              <button className="btn danger" disabled={periodoCerrado} onClick={() => setTarget(d)}>
                Cancelar inscripción
              </button>
              {periodoCerrado && <p className="err">El retiro está cerrado (mitad de semestre).</p>}
            </div>
          </article>
        ))}
      </div>
      {target && (
        <div className="modal-bg">
          <div className="modal">
            <h2>¿Retirarte de {target.nombre}?</h2>
            <div className="row">
              <button className="btn danger" onClick={() => {
                const r = retirar(target.id, user.id)
                setMsg(r.ok ? 'Inscripción cancelada' : r.error)
                setTarget(null)
              }}>Confirmar</button>
              <button className="btn ghost" onClick={() => setTarget(null)}>Volver</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
