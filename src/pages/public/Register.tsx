// src/pages/public/Register.tsx
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

// src/pages/public/Register.tsx
const register = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError(null)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    }
  })

  if (error) {
    if (error.message.includes('already registered') || error.message.includes('User already registered')) {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        }
      })

      if (resendError) {
        setError('Этот email уже используется. Не удалось отправить письмо подтверждения.')
      } else {
        setError('Этот email уже зарегистрирован. Мы отправили письмо подтверждения повторно. Проверьте почту.')
      }
    } else {
      setError(error.message)
    }
  } else {
    alert('Регистрация прошла успешно! Проверьте почту для подтверждения аккаунта.')
    navigate('/login')
  }

  setLoading(false)
}

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Логотип */}
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

        <div className="glass rounded-3xl p-10 shadow-2xl border border-purple-900/30">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-white mb-2">Создать аккаунт</h1>
            <p className="text-gray-400">Присоединяйтесь к системе управления яхт-портом</p>
          </div>

          <form onSubmit={register} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Полное имя</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input w-full"
                placeholder="Иван Иванов"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-950/50 border border-red-900 p-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3.5 text-base font-medium disabled:opacity-70"
            >
              {loading ? 'Создание аккаунта...' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="text-center mt-8 text-gray-400">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Войти
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          © 2026 Yacht Port System
        </p>
      </div>
    </div>
  )
}