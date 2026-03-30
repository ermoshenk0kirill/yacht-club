import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) navigate('/')
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 border rounded w-80 space-y-3">
        <h1 className="text-xl font-bold">Login</h1>
        <input className="border p-2 w-full" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="border p-2 w-full" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button className="bg-black text-white w-full p-2" onClick={handleLogin}>Login</button>
      </div>
    </div>
  )
}