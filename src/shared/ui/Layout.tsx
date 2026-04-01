// src/shared/ui/Layout.tsx
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'

export default function Layout({ children, title }: { children: React.ReactNode; title?: string }) {
  const { user, role } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Header */}
      <header className="border-b border-[#1f1f1f] bg-[#0a0a0a]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-violet-500 rounded-2xl flex items-center justify-center font-bold text-2xl">
              Y
            </div>
            <div>
              <div className="font-semibold text-2xl tracking-tight">Yacht Port</div>
              <div className="text-[10px] text-purple-400 -mt-1 tracking-[1px]">MARINA MANAGEMENT</div>
            </div>
          </div>

          <div className="flex items-center gap-8 text-sm">
            {user && (
              <div className="text-right">
                <div className="font-medium">{user.email}</div>
                <div className="text-xs text-purple-400 capitalize">{role}</div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="border-b border-[#1f1f1f] bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-8 py-5">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">Выход</Link>

            {role === 'captain' && (
              <>
                <Link to="/captain" className={`nav-link ${isActive('/captain') ? 'active' : ''}`}>Дашборд</Link>
                <Link to="/captain/news" className={`nav-link ${isActive('/captain/news') ? 'active' : ''}`}>Новости</Link>
                <Link to="/captain/vessels" className={`nav-link ${isActive('/captain/vessels') ? 'active' : ''}`}>Мои суда</Link>
                <Link to="/captain/bookings" className={`nav-link ${isActive('/captain/bookings') ? 'active' : ''}`}>Заявки</Link>
                <Link to="/captain/calendar" className={`nav-link ${isActive('/captain/calendar') ? 'active' : ''}`}>Календарь</Link>
              </>
            )}

            {role === 'manager' && (
              <>
                <Link to="/manager/bookings" className={`nav-link ${isActive('/manager/bookings') ? 'active' : ''}`}>Заявки</Link>
                <Link to="/manager/news" className={`nav-link ${isActive('/manager/news') ? 'active' : ''}`}>Новости</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {title && (
          <h1 className="text-4xl font-semibold mb-10 tracking-tight">{title}</h1>
        )}
        {children}
      </main>
    </div>
  )
}