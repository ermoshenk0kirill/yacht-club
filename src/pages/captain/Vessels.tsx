// src/pages/captain/Vessels.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../app/providers/AuthProvider'

export default function Vessels() {
  const { user } = useAuth()
  const [vessels, setVessels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // Форма добавления судна
  const [formData, setFormData] = useState({
    name: '',
    vessel_type: '',
    length_meters: '',
    width_meters: '',
    draft_meters: '',
    license_number: '',
    registration_number: '',
  })

  useEffect(() => {
    if (!user?.id) return

    supabase
      .from('vessels')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error)
        else setVessels(data || [])
        setLoading(false)
      })
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.id) {
      alert('Ошибка: пользователь не авторизован')
      return
    }

    const { error } = await supabase.from('vessels').insert({
      owner_id: user.id,                   
      name: formData.name,
      vessel_type: formData.vessel_type || null,
      length_meters: parseFloat(formData.length_meters),
      width_meters: parseFloat(formData.width_meters),
      draft_meters: parseFloat(formData.draft_meters),
      license_number: formData.license_number,
      registration_number: formData.registration_number,
    })

    if (error) {
      console.error(error)
      alert('Ошибка при добавлении судна: ' + error.message)
    } else {
      alert('Судно успешно добавлено!')
      
      // Сброс формы
      setFormData({
        name: '',
        vessel_type: '',
        length_meters: '',
        width_meters: '',
        draft_meters: '',
        license_number: '',
        registration_number: '',
      })
      setShowForm(false)

      // Обновляем список судов
      const { data } = await supabase
        .from('vessels')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

      setVessels(data || [])
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Мои суда</h1>
          <p className="text-gray-400 mt-2">Управление вашим флотом</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary px-6 py-3 flex items-center gap-2"
        >
          {showForm ? 'Отменить' : '+ Добавить судно'}
        </button>
      </div>

      {/* Форма добавления судна */}
      {showForm && (
        <div className="bg-[#111] border border-[#222] rounded-3xl p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-6">Добавить новое судно</h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Название судна</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input w-full"
                placeholder="Например: Sea Spirit"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Тип судна</label>
              <input
                type="text"
                value={formData.vessel_type}
                onChange={(e) => setFormData({ ...formData, vessel_type: e.target.value })}
                className="input w-full"
                placeholder="Яхта, Катамаран..."
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Номер лицензии</label>
              <input
                type="text"
                value={formData.license_number}
                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                className="input w-full"
                placeholder="LIC-98765"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Длина (м)</label>
              <input
                type="number"
                step="0.1"
                value={formData.length_meters}
                onChange={(e) => setFormData({ ...formData, length_meters: e.target.value })}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Ширина (м)</label>
              <input
                type="number"
                step="0.1"
                value={formData.width_meters}
                onChange={(e) => setFormData({ ...formData, width_meters: e.target.value })}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Осадка (м)</label>
              <input
                type="number"
                step="0.1"
                value={formData.draft_meters}
                onChange={(e) => setFormData({ ...formData, draft_meters: e.target.value })}
                className="input w-full"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Регистрационный номер</label>
              <input
                type="text"
                value={formData.registration_number}
                onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                className="input w-full"
                placeholder="REG-123456"
                required
              />
            </div>

            <div className="md:col-span-2 flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 btn btn-primary py-3.5"
              >
                Добавить судно
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 btn btn-secondary py-3.5"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Список судов */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Загрузка судов...</div>
      ) : vessels.length === 0 ? (
        <div className="bg-[#111] border border-[#222] rounded-3xl p-20 text-center">
          <div className="text-6xl mb-6">⛴️</div>
          <h3 className="text-2xl font-medium mb-3">У вас пока нет судов</h3>
          <p className="text-gray-400 mb-6">Добавьте первое судно, чтобы начать работу с заявками</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary px-8 py-3"
          >
            Добавить первое судно
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vessels.map((vessel) => (
            <div
              key={vessel.id}
              className="bg-[#111] border border-[#222] rounded-3xl p-8 hover:border-purple-500/50 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-white">{vessel.name}</h3>
                  {vessel.vessel_type && (
                    <p className="text-purple-400 text-sm mt-1">{vessel.vessel_type}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">ID</div>
                  <div className="font-mono text-sm text-gray-400">{vessel.id.slice(0, 8)}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center mb-8">
                <div>
                  <div className="text-xs text-gray-500">Длина</div>
                  <div className="text-xl font-semibold">{vessel.length_meters} <span className="text-sm">м</span></div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Ширина</div>
                  <div className="text-xl font-semibold">{vessel.width_meters} <span className="text-sm">м</span></div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Осадка</div>
                  <div className="text-xl font-semibold">{vessel.draft_meters} <span className="text-sm">м</span></div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#222] text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Лицензия</span>
                  <span className="font-medium">{vessel.license_number}</span>
                </div>
                <div className="flex justify-between mt-3">
                  <span className="text-gray-400">Регистрация</span>
                  <span className="font-medium">{vessel.registration_number}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}