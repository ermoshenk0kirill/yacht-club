import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const register = async () => {
    await supabase.auth.signUp({ email, password })
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 border rounded w-80 space-y-3">
        <h1 className="text-xl font-bold">Register</h1>
        <input className="border p-2 w-full" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="border p-2 w-full" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button className="bg-black text-white w-full p-2" onClick={register}>Register</button>
      </div>
    </div>
  )
}