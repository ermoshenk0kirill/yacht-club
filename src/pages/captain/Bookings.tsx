import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../app/providers/AuthProvider'

export default function Bookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    supabase.from('bookings').select('*').eq('captain_id', user.id)
      .then(({ data }) => setBookings(data || []))
  }, [user])

  const createBooking = async () => {
    await supabase.from('bookings').insert({
      captain_id: user.id,
      date: new Date().toISOString().split('T')[0],
      time_start: '10:00',
      time_end: '12:00',
      status: 'pending'
    })
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">My Requests</h1>
      <button className="bg-black text-white p-2" onClick={createBooking}>Create</button>

      {bookings.map(b => (
        <div key={b.id} className="border p-3 mt-3">
          <p>{b.date}</p>
          <p>Status: {b.status}</p>
        </div>
      ))}
    </div>
  )
}