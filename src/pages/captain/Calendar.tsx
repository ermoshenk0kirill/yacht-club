// src/pages/captain/Calendar.tsx
import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../app/providers/AuthProvider'

export default function CaptainCalendar() {
  const { user } = useAuth()
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    if (!user) return

    const fetchBookings = async () => {
      const { data } = await supabase
        .from('bookings')
        .select(`
          id, date, time_start, time_end, status, berth_number,
          vessel:vessels!bookings_vessel_id_fkey (name)
        `)
        .eq('captain_id', user.id)

      const calendarEvents = data?.map(b => ({
        id: b.id,
        title: `${b.vessel?.name || 'Судно'} • ${b.berth_number || '—'}`,
        start: `${b.date}T${b.time_start}`,
        end: `${b.date}T${b.time_end}`,
        backgroundColor: b.status === 'approved' ? '#22c55e' :
                         b.status === 'pending' ? '#eab308' : '#ef4444',
        textColor: '#ffffff',
        borderColor: b.status === 'approved' ? '#16a34a' :
                     b.status === 'pending' ? '#ca8a04' : '#dc2626',
        extendedProps: { 
          status: b.status,
          berth: b.berth_number 
        }
      })) || []

      setEvents(calendarEvents)
    }

    fetchBookings()
  }, [user])

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-semibold tracking-tight mb-8">Календарь стоянок</h1>
      
      <div className="bg-[#111] border border-[#222] rounded-3xl p-8 shadow-xl">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
          }}
          height="auto"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
          }}
          eventDisplay="block"
          dayMaxEvents={3}
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-6 text-sm justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Одобрено</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>В ожидании</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Отклонено</span>
        </div>
      </div>
    </div>
  )
}