import { Navigate, Outlet } from 'react-router-dom'
import { useStore } from '../store/StoreContext.jsx'

export default function ProtectedRoute({ roles }) {
  const { user } = useStore()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.rol)) return <Navigate to="/" replace />
  return <Outlet />
}
