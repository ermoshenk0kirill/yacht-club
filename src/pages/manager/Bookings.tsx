// src/pages/manager/Bookings.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ManagerBookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const fetchBookings = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        captain:profiles!bookings_captain_id_fkey (full_name, email),
        vessel:vessels!bookings_vessel_id_fkey (name, length_meters)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Ошибка загрузки заявок:', error)
      alert('Ошибка загрузки заявок: ' + error.message)
    } else {
      setBookings(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    if (!confirm(`Вы уверены, что хотите ${newStatus === 'approved' ? 'одобрить' : 'отклонить'} заявку?`)) return

    let updateData: any = { status: newStatus }

    if (newStatus === 'rejected') {
      const comment = prompt('Введите причину отклонения заявки:')
      if (comment?.trim()) {
        updateData.manager_comment = comment.trim()
      } else {
        alert('Причина отклонения не указана.')
        return
      }
    }

    const { error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)

    if (error) {
      alert('Ошибка обновления: ' + error.message)
    } else {
      fetchBookings()
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">Ожидает</span>
      case 'approved':
        return <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">Одобрено</span>
      case 'rejected':
        return <span className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs">Отклонено</span>
      default:
        return <span className="px-3 py-1 bg-gray-500/10 text-gray-400 rounded-full text-xs">{status}</span>
    }
  }

  const filteredBookings = bookings.filter(b => filter === 'all' || b.status === filter)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tight">Управление заявками</h1>
        <p className="text-gray-400 mt-2">Просмотр и обработка заявок капитанов</p>
      </div>

      {/* Фильтры */}
      <div className="flex gap-2 mb-6 bg-[#111] border border-[#222] rounded-2xl p-1">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
              filter === f ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-[#1a1a1a]'
            }`}
          >
            {f === 'all' && 'Все'}
            {f === 'pending' && 'Ожидают'}
            {f === 'approved' && 'Одобрены'}
            {f === 'rejected' && 'Отклонены'}
          </button>
        ))}
      </div>

      {loading && <div className="text-center py-20 text-gray-400">Загрузка заявок...</div>}

      {!loading && filteredBookings.length === 0 && (
        <div className="bg-[#111] border border-[#222] rounded-3xl p-20 text-center">
          <p className="text-xl text-gray-400">Нет заявок по выбранному фильтру</p>
        </div>
      )}

      {!loading && filteredBookings.length > 0 && (
        <div className="bg-[#111] border border-[#222] rounded-3xl overflow-hidden">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left p-5 w-44">Период стоянки</th>
                <th className="text-left p-5">Капитан / Судно</th>
                <th className="text-left p-5 w-24">Берт</th>
                <th className="text-left p-5 w-28">Статус</th>
                <th className="text-left p-5">Документы</th>
                <th className="text-left p-5">Комментарий менеджера</th>
                <th className="text-right p-5 w-40">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#1a1a1a]">
                  <td className="p-5">
                    <div className="font-medium">{new Date(b.date).toLocaleDateString('ru-RU')}</div>
                    <div className="text-sm text-gray-400">{b.time_start} — {b.time_end}</div>
                  </td>

                  <td className="p-5">
                    <div className="font-medium">{b.captain?.full_name || '—'}</div>
                    <div className="text-sm text-gray-400">{b.vessel?.name || '—'}</div>
                  </td>

                  <td className="p-5 font-medium">{b.berth_number || '—'}</td>

                  <td className="p-5">{getStatusBadge(b.status)}</td>

                  <td className="p-5">
                    {b.documents && Array.isArray(b.documents) && b.documents.length > 0 ? (
                      <div className="space-y-1 text-sm">
                        {b.documents.slice(0, 2).map((doc: any, index: number) => (
                          <a
                            key={index}
                            href={supabase.storage.from('documents').getPublicUrl(doc.file_path).data.publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:underline block truncate max-w-[220px]"
                          >
                            📎 {doc.file_name}
                          </a>
                        ))}
                        {b.documents.length > 2 && (
                          <span className="text-gray-500 text-xs">+{b.documents.length - 2}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>

                  <td className="p-5 text-sm text-gray-300 max-w-xs">
                    {b.manager_comment ? (
                      <span className="line-clamp-2 italic">«{b.manager_comment}»</span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>

                  <td className="p-5 text-right">
                    {b.status === 'pending' && (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => updateStatus(b.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded-xl text-sm font-medium transition-colors"
                        >
                          Одобрить
                        </button>
                        <button
                          onClick={() => updateStatus(b.id, 'rejected')}
                          className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-xl text-sm font-medium transition-colors"
                        >
                          Отклонить
                        </button>
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