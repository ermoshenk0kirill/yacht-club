// src/pages/captain/Bookings.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../app/providers/AuthProvider'
import { useNavigate } from 'react-router-dom'

export default function CaptainBookings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    supabase
      .from('bookings')
      .select(`
        *,
        vessel:vessels!bookings_vessel_id_fkey (name, length_meters)
      `)
      .eq('captain_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setBookings(data || [])
        setLoading(false)
      })
  }, [user])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': 
        return <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm">В ожидании</span>
      case 'approved': 
        return <span className="px-4 py-1.5 bg-green-500/10 text-green-400 rounded-full text-sm">Одобрено</span>
      case 'rejected': 
        return <span className="px-4 py-1.5 bg-red-500/10 text-red-400 rounded-full text-sm">Отклонено</span>
      default: 
        return <span className="px-4 py-1.5 bg-gray-500/10 text-gray-400 rounded-full text-sm">{status}</span>
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Мои заявки</h1>
          <p className="text-gray-400 mt-2">История ваших заявок</p>
        </div>
        <button onClick={() => navigate('/captain')} className="btn btn-primary">+ Новая заявка</button>
      </div>

      {loading ? (
        <div className="text-center py-20">Загрузка...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-[#111] border border-[#222] rounded-3xl p-20 text-center">
          <p className="text-2xl text-gray-400">У вас пока нет заявок</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(b => (
            <div key={b.id} className="bg-[#111] border border-[#222] rounded-3xl p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{b.vessel?.name}</h3>
                  <p className="text-gray-400 mt-1">
                    {new Date(b.date).toLocaleDateString('ru-RU')} • {b.time_start} — {b.time_end}
                  </p>
                  {b.slot_range && (
                    <p className="text-sm text-purple-400 mt-1">Период: {String(b.slot_range)}</p>
                  )}
                </div>
                <div>{getStatusBadge(b.status)}</div>
              </div>

              {b.berth_number && (
                <p className="mt-3">Берт: <span className="text-purple-400 font-medium">{b.berth_number}</span></p>
              )}

              {b.request_comment && (
                <p className="mt-3 text-gray-300 italic">«{b.request_comment}»</p>
              )}

              {/* Комментарий от менеджера */}
              {b.manager_comment && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <p className="text-red-400 text-sm font-medium mb-1">Комментарий от менеджера:</p>
                  <p className="text-gray-300 italic">«{b.manager_comment}»</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}