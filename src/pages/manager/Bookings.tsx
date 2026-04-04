// src/pages/manager/Bookings.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Booking = {
  id: string
  date: string
  time_start: string
  time_end: string
  status: 'pending' | 'approved' | 'rejected' | string
  berth_number: string | null
  request_comment: string | null
  manager_comment: string | null
  created_at: string | null
  captain: {
    email: string
    full_name: string
  } | null
  vessel: {
    name: string
    length_meters: number
  } | null
}

export default function ManagerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchBookings = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        captain:profiles!bookings_captain_id_fkey (email, full_name),
        vessel:vessels!bookings_vessel_id_fkey (name, length_meters)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookings:', error)
    } else {
      const typedBookings: Booking[] = (data || []).map((b: any) => ({
        ...b,
        status: b.status as 'pending' | 'approved' | 'rejected' | string,
        created_at: b.created_at,
        captain: b.captain,
        vessel: b.vessel,
      }))
      setBookings(typedBookings)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected', comment?: string) => {
    if (updatingId) return
    setUpdatingId(id)

    const { error } = await supabase
      .from('bookings')
      .update({
        status: newStatus,
        manager_comment: comment || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      alert('Ошибка при обновлении статуса: ' + error.message)
    } else {
      alert(`Заявка ${newStatus === 'approved' ? 'одобрена' : 'отклонена'}`)
      fetchBookings()
    }

    setUpdatingId(null)
  }

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true
    return booking.status === filter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium">В ожидании</span>
      case 'approved':
        return <span className="px-4 py-1.5 bg-green-500/10 text-green-400 rounded-full text-sm font-medium">Одобрено</span>
      case 'rejected':
        return <span className="px-4 py-1.5 bg-red-500/10 text-red-400 rounded-full text-sm font-medium">Отклонено</span>
      default:
        return <span className="px-4 py-1.5 bg-gray-500/10 text-gray-400 rounded-full text-sm font-medium">{status}</span>
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Управление заявками</h1>
          <p className="text-gray-400 mt-2">Обработка запросов капитанов на заход в порт</p>
        </div>

        <div className="flex gap-2 bg-[#111] border border-[#222] rounded-2xl p-1">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filter === f 
                  ? 'bg-purple-600 text-white shadow-sm' 
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              {f === 'all' && 'Все'}
              {f === 'pending' && 'Ожидают'}
              {f === 'approved' && 'Одобрены'}
              {f === 'rejected' && 'Отклонены'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-32">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Загрузка заявок...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-[#111] border border-[#222] rounded-3xl p-20 text-center">
          <p className="text-2xl text-gray-400">Нет заявок в выбранном фильтре</p>
        </div>
      ) : (
        <div className="bg-[#111] border border-[#222] rounded-3xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-6 font-medium text-gray-400">Дата и время</th>
                <th className="text-left p-6 font-medium text-gray-400">Капитан / Судно</th>
                <th className="text-left p-6 font-medium text-gray-400">Берт</th>
                <th className="text-left p-6 font-medium text-gray-400">Статус</th>
                <th className="text-right p-6 font-medium text-gray-400 w-52">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-6">
                    <div className="font-medium">
                      {new Date(booking.date).toLocaleDateString('ru-RU', { 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {booking.time_start} — {booking.time_end}
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="font-medium">
                      {booking.captain?.full_name || 'Неизвестный капитан'}
                    </div>
                    <div className="text-sm text-gray-400">
                      {booking.vessel?.name} • {booking.vessel?.length_meters || '?'} м
                    </div>
                  </td>

                  <td className="p-6 font-medium text-gray-300">
                    {booking.berth_number || '—'}
                  </td>

                  <td className="p-6">
                    {getStatusBadge(booking.status)}
                  </td>

                  <td className="p-6 text-right">
                    {booking.status === 'pending' && (
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => updateStatus(booking.id, 'approved')}
                          disabled={updatingId === booking.id}
                          className="px-6 py-2.5 bg-green-600 hover:bg-green-700 rounded-2xl text-sm font-medium transition disabled:opacity-50"
                        >
                          Одобрить
                        </button>
                        <button
                          onClick={() => {
                            const comment = prompt('Введите комментарий для капитана (необязательно):')
                            updateStatus(booking.id, 'rejected', comment || undefined)
                          }}
                          disabled={updatingId === booking.id}
                          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 rounded-2xl text-sm font-medium transition disabled:opacity-50"
                        >
                          Отклонить
                        </button>
                      </div>
                    )}

                    {booking.manager_comment && (
                      <div className="text-xs text-gray-500 mt-3 text-right">
                        Комментарий: {booking.manager_comment}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}