import { useState } from 'react'
import { useStore } from '../../store/StoreContext.jsx'

export default function EventosEst() {
  const { user, eventos, inscribirEvento } = useStore()
  const [msg, setMsg] = useState('')
  const futuros = eventos.filter((e) => e.fecha >= new Date().toISOString().slice(0, 10))

  return (
    <>
      <h1>Eventos</h1>
      {msg && <p><strong>{msg}</strong></p>}
      <div className="cards">
        {futuros.map((ev) => (
          <article className="card" key={ev.id}>
            <div className="body">
              <span className="chip">{ev.tipo}</span>
              <h3>{ev.nombre}</h3>
              <p><strong>{ev.fecha}</strong> · {ev.lugar}</p>
              <p>{ev.inscritosIds.length}/{ev.cupo} cupos</p>
              <button
                className="btn gold"
                disabled={ev.inscritosIds.includes(user.id) || ev.inscritosIds.length >= ev.cupo}
                onClick={() => {
                  const r = inscribirEvento(ev.id, user.id)
                  setMsg(r.ok ? `Participas en ${ev.nombre}` : r.error)
                }}
              >
                {ev.inscritosIds.includes(user.id) ? 'Inscrito' : 'Participar'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
