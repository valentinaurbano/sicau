import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useStore } from '../../store/StoreContext.jsx'

export default function AdminDashboard() {
  const { deportes, eventos, users } = useStore()
  const data = deportes.map((d) => ({
    nombre: d.nombre,
    inscritos: d.inscritosIds.length,
    cupo: d.cupo,
  }))
  const ocupados = deportes.reduce((s, d) => s + d.inscritosIds.length, 0)
  const cupos = deportes.reduce((s, d) => s + d.cupo, 0)

  return (
    <>
      <div className="topbar">
        <h1>Dashboard de ocupación</h1>
      </div>
      <div className="cards" style={{ marginBottom: 20 }}>
        <div className="kpi"><small>Deportes</small><h2>{deportes.length}</h2></div>
        <div className="kpi"><small>Cupos usados</small><h2>{ocupados}/{cupos}</h2></div>
        <div className="kpi"><small>Eventos</small><h2>{eventos.length}</h2></div>
        <div className="kpi"><small>Estudiantes</small><h2>{users.filter((u) => u.rol === 'estudiante').length}</h2></div>
      </div>
      <div className="card">
        <div className="body" style={{ height: 320 }}>
          {deportes.length === 0 ? (
            <p>Sin datos · gráficas en cero</p>
          ) : (
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cupo" fill="#f5a524" name="Cupo" />
                <Bar dataKey="inscritos" fill="#0d2178" name="Inscritos" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
  )
}
