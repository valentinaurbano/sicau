import { useState } from 'react'
import { useStore } from '../../store/StoreContext.jsx'

export default function Comunicados() {
  const { alertas, addAlerta, periodoCerrado, setPeriodoCerrado } = useStore()
  const [titulo, setTitulo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [audiencia, setAudiencia] = useState('Todos')

  function submit(e) {
    e.preventDefault()
    if (!titulo || !mensaje) return
    addAlerta({ titulo, mensaje, audiencia })
    setTitulo(''); setMensaje('')
  }

  return (
    <>
      <h1>Comunicados</h1>
      <label className="row" style={{ margin: '12px 0' }}>
        <input type="checkbox" checked={periodoCerrado} onChange={(e) => setPeriodoCerrado(e.target.checked)} />
        Cerrar retiros de estudiantes (mitad de semestre)
      </label>
      <form onSubmit={submit} className="card" style={{ padding: 16, marginBottom: 20 }}>
        <label className="field"><span>Título</span><input value={titulo} onChange={(e) => setTitulo(e.target.value)} /></label>
        <label className="field"><span>Mensaje</span><textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} /></label>
        <label className="field"><span>Audiencia</span>
          <select value={audiencia} onChange={(e) => setAudiencia(e.target.value)}>
            <option>Todos</option>
            <option>Solo docentes</option>
            <option>Solo estudiantes</option>
            <option>Solo admin</option>
          </select>
        </label>
        <button className="btn primary" type="submit">Enviar alerta</button>
      </form>
      {alertas.map((a) => (
        <div className="card" key={a.id} style={{ marginBottom: 8 }}>
          <div className="body">
            <strong>{a.titulo}</strong> · <small>{a.audiencia}</small>
            <p>{a.mensaje}</p>
          </div>
        </div>
      ))}
    </>
  )
}
