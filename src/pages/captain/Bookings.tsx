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
  const [deletingId, setDeletingId] = useState<string | null>(null)

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
      .then(({ data, error }) => {
        if (error) console.error(error)
        else setBookings(data || [])
        setLoading(false)
      })
  }, [user])

  const deleteBooking = async (bookingId: string, date: string) => {
    if (!confirm(`Вы уверены, что хотите удалить заявку на ${new Date(date).toLocaleDateString('ru-RU')}?\n\nЭто действие нельзя отменить.`)) {
      return
    }

    setDeletingId(bookingId)

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId)

    if (error) {
      alert('Ошибка при удалении заявки: ' + error.message)
    } else {
      alert('Заявка успешно удалена')
      setBookings(bookings.filter(b => b.id !== bookingId))
    }

    setDeletingId(null)
  }

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
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Мои заявки</h1>
          <p className="text-gray-400 mt-2">История и статус ваших запросов на заход в порт</p>
        </div>

        {/* Исправленная кнопка */}
        <button
          onClick={() => navigate('/captain')}
          className="btn btn-primary px-6 py-3 flex items-center gap-2"
        >
          + Новая заявка
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Загрузка заявок...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-[#111] border border-[#222] rounded-3xl p-20 text-center">
          <div className="text-6xl mb-6">📅</div>
          <h3 className="text-2xl font-medium mb-3">У вас пока нет заявок</h3>
          <p className="text-gray-400 mb-6">Создайте первую заявку на заход в порт</p>
          <button
            onClick={() => navigate('/captain')}
            className="btn btn-primary px-8 py-3"
          >
            Создать заявку
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-[#111] border border-[#222] rounded-3xl p-8 hover:border-purple-500/50 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-white">
                        {booking.vessel?.name || 'Неизвестное судно'}
                      </h3>
                      <p className="text-gray-400">
                        {new Date(booking.date).toLocaleDateString('ru-RU', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-sm">
                    <div>
                      <span className="text-gray-400">Время:</span>{' '}
                      <span className="font-medium">{booking.time_start} — {booking.time_end}</span>
                    </div>
                    {booking.berth_number && (
                      <div>
                        <span className="text-gray-400">Берт:</span>{' '}
                        <span className="font-medium text-purple-400">{booking.berth_number}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  {getStatusBadge(booking.status)}

                  <button
                    onClick={() => deleteBooking(booking.id, booking.date)}
                    disabled={deletingId === booking.id}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white text-sm font-medium rounded-2xl transition-all"
                  >
                    {deletingId === booking.id ? 'Удаление...' : 'Удалить заявку'}
                  </button>
                </div>
              </div>

              {booking.request_comment && (
                <div className="mt-6 pt-6 border-t border-[#222] text-sm text-gray-300">
                  <span className="text-gray-400">Комментарий:</span> {booking.request_comment}
                </div>
              )}

              {booking.manager_comment && (
                <div className="mt-4 text-sm text-red-400">
                  <span className="font-medium">Комментарий менеджера:</span> {booking.manager_comment}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}