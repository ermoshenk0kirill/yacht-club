// src/pages/public/Login.tsx
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { role } = useAuth() // будет обновляться после логина

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Небольшая задержка, чтобы роль успела загрузиться
    setTimeout(() => {
      if (role === 'manager') {
        navigate('/manager/bookings')
      } else if (role === 'captain') {
        navigate('/captain/news')
      } else {
        navigate('/captain/news') // fallback
      }
    }, 300)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              Y
            </div>
            <div>
              <div className="text-3xl font-semibold tracking-tight text-white">Yacht Port</div>
              <div className="text-xs text-purple-400 -mt-1">MARINA MANAGEMENT</div>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-[#222] rounded-3xl p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-white mb-2">Добро пожаловать</h1>
            <p className="text-gray-400">Войдите в свой аккаунт</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <div className="text-red-400 text-sm text-center bg-red-950/50 border border-red-900 p-3 rounded-xl">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-medium py-3.5 rounded-xl transition-all"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="text-center mt-8 text-gray-400">
            Нет аккаунта?{' '}
            <a href="/register" className="text-purple-400 hover:text-purple-300 font-medium">Зарегистрироваться</a>
          </div>
        </div>
      </div>
    </div>
  )
}