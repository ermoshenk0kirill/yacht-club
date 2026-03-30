import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'

export default function Layout({ children, title }: { children: React.ReactNode; title?: string }) {
  const { user, role } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              Y
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Yacht Port</h1>
          </div>

          <div className="flex items-center gap-4 text-sm">
            {user && (
              <div className="text-right">
                <div className="font-medium">{user.email}</div>
                <div className="text-xs text-purple-400 capitalize">{role}</div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          
          {role === 'captain' && (
            <>
              <Link to="/captain" className={`nav-link ${isActive('/captain') ? 'active' : ''}`}>Dashboard</Link>
              <Link to="/captain/vessels" className={`nav-link ${isActive('/captain/vessels') ? 'active' : ''}`}>Vessels</Link>
              <Link to="/captain/bookings" className={`nav-link ${isActive('/captain/bookings') ? 'active' : ''}`}>Bookings</Link>
              <Link to="/captain/calendar" className={`nav-link ${isActive('/captain/calendar') ? 'active' : ''}`}>Calendar</Link>
            </>
          )}

          {role === 'manager' && (
            <>
              <Link to="/manager" className={`nav-link ${isActive('/manager') ? 'active' : ''}`}>Dashboard</Link>
              <Link to="/manager/bookings" className={`nav-link ${isActive('/manager/bookings') ? 'active' : ''}`}>Bookings</Link>
              <Link to="/manager/news" className={`nav-link ${isActive('/manager/news') ? 'active' : ''}`}>News</Link>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="main">
        {title && <h1 className="text-3xl font-semibold mb-8">{title}</h1>}
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-[#222] py-6 text-center text-sm text-gray-500">
        © 2026 Yacht Port System • Professional Marina Management
      </footer>
    </div>
  )
}