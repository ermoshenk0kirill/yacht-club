import { Navigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'

export const ProtectedRoute = ({ children, role }: any) => {
  const { user, role: userRole } = useAuth()

  if (!user) return <Navigate to="/login" />
  if (role && userRole !== role) return <Navigate to="/" />

  return children
}