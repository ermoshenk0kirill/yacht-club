// src/pages/captain/Dashboard.tsx
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../app/providers/AuthProvider'

export default function CaptainDashboard() {
  const { user } = useAuth()
  const [vessels, setVessels] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Форма добавления судна
  const [vesselForm, setVesselForm] = useState({
    name: '',
    vessel_type: '',
    length_meters: '',
    width_meters: '',
    draft_meters: '',
    license_number: '',
    registration_number: '',
  })

  // Форма создания заявки
  const [bookingForm, setBookingForm] = useState({
    vessel_id: '',
    date: '',
    time_start: '09:00',
    time_end: '18:00',
    berth_number: '',
    request_comment: '',
  })

  // Загрузка списка судов капитана
  useEffect(() => {
    if (!user?.id) return

    supabase
      .from('vessels')
      .select('*')
      .eq('owner_id', user.id)
      .then(({ data, error }) => {
        if (error) console.error(error)
        else setVessels(data || [])
      })
  }, [user])

  // Добавление нового судна
  const handleVesselSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) {
      alert('Ошибка: пользователь не авторизован')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('vessels').insert({
      owner_id: user.id,                    // ← Это было обязательно!
      name: vesselForm.name,
      vessel_type: vesselForm.vessel_type || null,
      length_meters: parseFloat(vesselForm.length_meters),
      width_meters: parseFloat(vesselForm.width_meters),
      draft_meters: parseFloat(vesselForm.draft_meters),
      license_number: vesselForm.license_number,
      registration_number: vesselForm.registration_number,
    })

    if (error) {
      console.error(error)
      alert('Ошибка при добавлении судна: ' + error.message)
    } else {
      alert('Судно успешно добавлено!')
      // Сброс формы
      setVesselForm({
        name: '',
        vessel_type: '',
        length_meters: '',
        width_meters: '',
        draft_meters: '',
        license_number: '',
        registration_number: '',
      })
      // Обновляем список судов
      window.location.reload()
    }

    setLoading(false)
  }

  // Создание заявки на заход
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !bookingForm.vessel_id || !bookingForm.date) {
      alert('Пожалуйста, заполните все обязательные поля')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('bookings').insert({
      captain_id: user.id,
      vessel_id: bookingForm.vessel_id,
      date: bookingForm.date,
      time_start: bookingForm.time_start,
      time_end: bookingForm.time_end,
      berth_number: bookingForm.berth_number || null,
      request_comment: bookingForm.request_comment || null,
      status: 'pending',
    })

    if (error) {
      alert('Ошибка при создании заявки: ' + error.message)
    } else {
      alert('Заявка успешно создана!')
      setBookingForm({
        vessel_id: '',
        date: '',
        time_start: '09:00',
        time_end: '18:00',
        berth_number: '',
        request_comment: '',
      })
    }

    setLoading(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* === Форма добавления судна === */}
      <div className="bg-[#111] border border-[#222] rounded-3xl p-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          🚢 Добавить новое судно
        </h2>

        <form onSubmit={handleVesselSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Название судна *</label>
            <input
              type="text"
              value={vesselForm.name}
              onChange={(e) => setVesselForm({ ...vesselForm, name: e.target.value })}
              className="input w-full"
              placeholder="Sea Breeze"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Тип судна</label>
              <input
                type="text"
                value={vesselForm.vessel_type}
                onChange={(e) => setVesselForm({ ...vesselForm, vessel_type: e.target.value })}
                className="input w-full"
                placeholder="Яхта / Катамаран"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Номер лицензии *</label>
              <input
                type="text"
                value={vesselForm.license_number}
                onChange={(e) => setVesselForm({ ...vesselForm, license_number: e.target.value })}
                className="input w-full"
                placeholder="LIC-12345"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Длина (м) *</label>
              <input
                type="number"
                step="0.1"
                value={vesselForm.length_meters}
                onChange={(e) => setVesselForm({ ...vesselForm, length_meters: e.target.value })}
                className="input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Ширина (м) *</label>
              <input
                type="number"
                step="0.1"
                value={vesselForm.width_meters}
                onChange={(e) => setVesselForm({ ...vesselForm, width_meters: e.target.value })}
                className="input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Осадка (м) *</label>
              <input
                type="number"
                step="0.1"
                value={vesselForm.draft_meters}
                onChange={(e) => setVesselForm({ ...vesselForm, draft_meters: e.target.value })}
                className="input w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Регистрационный номер *</label>
            <input
              type="text"
              value={vesselForm.registration_number}
              onChange={(e) => setVesselForm({ ...vesselForm, registration_number: e.target.value })}
              className="input w-full"
              placeholder="REG-987654"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-4 text-lg font-medium disabled:opacity-70"
          >
            {loading ? 'Добавление судна...' : 'Добавить судно'}
          </button>
        </form>
      </div>

      {/* === Форма создания заявки === */}
      <div className="bg-[#111] border border-[#222] rounded-3xl p-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          📅 Создать заявку на заход в порт
        </h2>

        <form onSubmit={handleBookingSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Выберите судно *</label>
            <select
              value={bookingForm.vessel_id}
              onChange={(e) => setBookingForm({ ...bookingForm, vessel_id: e.target.value })}
              className="input w-full"
              required
            >
              <option value="">— Выберите судно —</option>
              {vessels.map((vessel) => (
                <option key={vessel.id} value={vessel.id}>
                  {vessel.name} — {vessel.length_meters}м
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Дата захода *</label>
            <input
              type="date"
              value={bookingForm.date}
              onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
              className="input w-full"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Время начала</label>
              <input
                type="time"
                value={bookingForm.time_start}
                onChange={(e) => setBookingForm({ ...bookingForm, time_start: e.target.value })}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Время окончания</label>
              <input
                type="time"
                value={bookingForm.time_end}
                onChange={(e) => setBookingForm({ ...bookingForm, time_end: e.target.value })}
                className="input w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Номер берта (причал)</label>
            <input
              type="text"
              value={bookingForm.berth_number}
              onChange={(e) => setBookingForm({ ...bookingForm, berth_number: e.target.value })}
              className="input w-full"
              placeholder="A-12 или Pier 5"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Комментарий к заявке</label>
            <textarea
              value={bookingForm.request_comment}
              onChange={(e) => setBookingForm({ ...bookingForm, request_comment: e.target.value })}
              className="input w-full h-24"
              placeholder="Дополнительные пожелания или особые требования..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-4 text-lg font-medium disabled:opacity-70"
          >
            {loading ? 'Отправка заявки...' : 'Отправить заявку на заход'}
          </button>
        </form>
      </div>
    </div>
  )
}