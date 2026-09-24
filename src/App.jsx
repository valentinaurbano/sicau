import { Navigate, Route, Routes } from 'react-router-dom'
import { useStore } from './store/StoreContext.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import { rutaInicial } from './auth/rutas.js'
import AppLayout from './layouts/AppLayout.jsx'
import Login from './pages/Login.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import Deportes from './pages/admin/Deportes.jsx'
import DeporteDetalle from './pages/admin/DeporteDetalle.jsx'
import Eventos from './pages/admin/Eventos.jsx'
import Usuarios from './pages/admin/Usuarios.jsx'
import Comunicados from './pages/admin/Comunicados.jsx'
import DocenteHome from './pages/docente/DocenteHome.jsx'
import Grupo from './pages/docente/Grupo.jsx'
import Asistencia from './pages/docente/Asistencia.jsx'
import HistorialAsistencia from './pages/docente/HistorialAsistencia.jsx'
import Catalogo from './pages/estudiante/Catalogo.jsx'
import EventosEst from './pages/estudiante/EventosEst.jsx'
import MisDeportes from './pages/estudiante/MisDeportes.jsx'
import Horario from './pages/estudiante/Horario.jsx'
import Home from './pages/Home.jsx'

export default function App() {
  const { user } = useStore()
  const destino = rutaInicial(user)

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to={destino} replace /> : (
          <div className="public-shell">
            <Home />
          </div>
        )}
      />
      <Route path="/login" element={user ? <Navigate to={destino} replace /> : <Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/inicio" element={<Home />} />

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/deportes" element={<Deportes />} />
            <Route path="/admin/deportes/:id" element={<DeporteDetalle />} />
            <Route path="/admin/eventos" element={<Eventos />} />
            <Route path="/admin/usuarios" element={<Usuarios />} />
            <Route path="/admin/comunicados" element={<Comunicados />} />
          </Route>

          <Route element={<ProtectedRoute roles={['docente']} />}>
            <Route path="/docente" element={<DocenteHome />} />
            <Route path="/docente/grupos/:id" element={<Grupo />} />
            <Route path="/docente/grupos/:id/asistencia" element={<Asistencia />} />
            <Route path="/docente/asistencias" element={<HistorialAsistencia />} />
          </Route>

          <Route element={<ProtectedRoute roles={['estudiante']} />}>
            <Route path="/estudiante/catalogo" element={<Catalogo />} />
            <Route path="/estudiante/eventos" element={<EventosEst />} />
            <Route path="/estudiante/mis-deportes" element={<MisDeportes />} />
            <Route path="/estudiante/horario" element={<Horario />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={destino} replace />} />
    </Routes>
  )
}
