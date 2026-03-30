import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ManagerBookings() {
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    supabase.from('bookings').select('*').then(({ data }) => {
      setBookings(data || [])
    })
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('bookings').update({ status }).eq('id', id)
  }

  return (
    <div>
      <h1>Manage Bookings</h1>
      {bookings.map(b => (
        <div key={b.id}>
          {b.date} - {b.status}
          <button onClick={() => updateStatus(b.id, 'approved')}>Approve</button>
          <button onClick={() => updateStatus(b.id, 'rejected')}>Reject</button>
        </div>
      ))}
    </div>
  )
}
