import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Calendar() {
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    supabase.from('bookings').select('*').then(({ data }) => {
      setBookings(data || [])
    })
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Calendar</h1>
      {bookings.map(b => (
        <div key={b.id}>
          {b.date} ({b.time_start}-{b.time_end})
        </div>
      ))}
    </div>
  )
}