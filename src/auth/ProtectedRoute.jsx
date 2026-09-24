import { Navigate, Outlet } from 'react-router-dom'
import { useStore } from '../store/StoreContext.jsx'
import { rutaInicial } from './rutas.js'

export default function ProtectedRoute({ roles }) {
  const { user } = useStore()
  if (!user) return <Navigate to="/login" replace />
  if (roles?.length && !roles.includes(user.rol)) return <Navigate to={rutaInicial(user)} replace />
  return <Outlet />
}
