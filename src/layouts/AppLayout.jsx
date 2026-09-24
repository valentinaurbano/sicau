import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useStore } from '../store/StoreContext.jsx'

const menus = {
  admin: [
    ['/admin', 'Dashboard'],
    ['/admin/deportes', 'Deportes'],
    ['/admin/eventos', 'Eventos'],
    ['/admin/usuarios', 'Usuarios'],
    ['/admin/comunicados', 'Comunicados'],
  ],
  docente: [
    ['/docente', 'Hoy'],
    ['/docente/asistencias', 'Historial'],
  ],
  estudiante: [
    ['/estudiante/catalogo', 'Catálogo'],
    ['/estudiante/eventos', 'Eventos'],
    ['/estudiante/mis-deportes', 'Mis deportes'],
    ['/estudiante/horario', 'Mi horario'],
  ],
}

export default function AppLayout() {
  const { user, logout, alertas } = useStore()
  const nav = useNavigate()
  const links = menus[user.rol] || []
  const visibles = alertas.filter((a) => a.audiencia === 'Todos' || a.audiencia.toLowerCase().includes(user.rol))

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          Uniautónoma
          <small>Universidad Autónoma del Cauca</small>
        </div>
        <nav className="nav">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to.split('/').length <= 2}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="side-user">
          {user.nombre}
          <br />
          <small>{user.rol}{user.categoria ? ` · ${user.categoria}` : ''}</small>
          <div style={{ marginTop: 8 }}>
            <button
              className="btn ghost"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}
              onClick={() => { logout(); nav('/login') }}
            >
              Salir
            </button>
          </div>
        </div>
      </aside>
      <main className="content">
        {visibles[0] && (
          <div className="card" style={{ marginBottom: 16, borderLeft: '6px solid var(--orange)' }}>
            <div className="body">
              <strong>{visibles[0].titulo}</strong>
              <div>{visibles[0].mensaje}</div>
            </div>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  )
}
