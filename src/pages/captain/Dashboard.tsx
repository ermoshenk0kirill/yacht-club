// src/pages/captain/Dashboard.tsx
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../app/providers/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'

const AVAILABLE_BERTHS = [
  'A-01', 'A-02', 'A-03', 'A-04', 'A-05',
  'B-01', 'B-02', 'B-03', 'B-04', 'B-05',
  'C-01', 'C-02', 'C-03',
  'D-01', 'D-02',
  'VIP-01', 'VIP-02'
]

export default function CaptainDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [vessels, setVessels] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [bookingForm, setBookingForm] = useState({
    vessel_id: '',
    arrival_date: '',
    arrival_time: '09:00',
    departure_date: '',
    departure_time: '18:00',
    berth_number: '',
    request_comment: '',
  })

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  useEffect(() => {
    if (!user?.id) return
    supabase
      .from('vessels')
      .select('*')
      .eq('owner_id', user.id)
      .then(({ data }) => setVessels(data || []))
  }, [user])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      console.log('Выбрано файлов:', files.map(f => f.name))
      setSelectedFiles(prev => [...prev, ...files])
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setBookingForm({
      vessel_id: '',
      arrival_date: '',
      arrival_time: '09:00',
      departure_date: '',
      departure_time: '18:00',
      berth_number: '',
      request_comment: '',
    })
    setSelectedFiles([])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.id || !bookingForm.vessel_id || !bookingForm.arrival_date) {
      alert('Пожалуйста, заполните обязательные поля')
      return
    }

    setLoading(true)

    try {
      const documentList: any[] = []

      if (selectedFiles.length > 0) {
        setUploading(true)
        console.log(`Начинаем загрузку ${selectedFiles.length} файлов...`)

        for (const file of selectedFiles) {
          const fileName = `${Date.now()}-${file.name}`
          const filePath = `bookings/${Date.now()}-${file.name}`

          console.log(`Загружаем: ${file.name}`)

          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file, { upsert: true })

          if (uploadError) {
            console.error('Upload error:', uploadError)
          } else {
            documentList.push({
              file_name: file.name,
              file_path: filePath,
              file_type: file.type
            })
            console.log(`✅ Загружен: ${file.name}`)
          }
        }
        setUploading(false)
      }

      // Создаём заявку
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          captain_id: user.id,
          vessel_id: bookingForm.vessel_id,
          date: bookingForm.arrival_date,
          time_start: bookingForm.arrival_time,
          time_end: bookingForm.departure_time,
          berth_number: bookingForm.berth_number || null,
          request_comment: bookingForm.request_comment || null,
          status: 'pending',
          documents: documentList.length > 0 ? documentList : null
        })
        .select()
        .single()

      if (bookingError || !booking) {
        throw new Error(bookingError?.message || 'Ошибка создания заявки')
      }

      alert(`✅ Заявка успешно создана!\nПрикреплено документов: ${documentList.length}`)
      console.log('Заявка создана:', booking)

      resetForm()
    } catch (error: any) {
      console.error('Ошибка:', error)
      alert('Ошибка: ' + error.message)
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">Главная</h1>
        <p className="text-gray-400 mt-2">Создайте новую заявку на заход в порт</p>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-3xl p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Новая заявка на заход</h2>
          <button 
            onClick={() => navigate('/captain/vessels')} 
            className="btn btn-primary px-6 py-3"
          >
            Добавить новое судно
          </button>
        </div>

        <form onSubmit={handleBookingSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Выберите судно</label>
            <select 
              value={bookingForm.vessel_id} 
              onChange={(e) => setBookingForm({ ...bookingForm, vessel_id: e.target.value })} 
              className="input w-full" 
              required
            >
              <option value="">— Выберите судно —</option>
              {vessels.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} — {v.length_meters}м
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Дата захода</label>
              <input type="date" value={bookingForm.arrival_date} onChange={e => setBookingForm({...bookingForm, arrival_date: e.target.value})} className="input w-full" required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Время захода</label>
              <input type="time" value={bookingForm.arrival_time} onChange={e => setBookingForm({...bookingForm, arrival_time: e.target.value})} className="input w-full" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Дата выхода</label>
              <input type="date" value={bookingForm.departure_date} onChange={e => setBookingForm({...bookingForm, departure_date: e.target.value})} className="input w-full" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Время выхода</label>
              <input type="time" value={bookingForm.departure_time} onChange={e => setBookingForm({...bookingForm, departure_time: e.target.value})} className="input w-full" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Желаемый берт</label>
            <select value={bookingForm.berth_number} onChange={e => setBookingForm({...bookingForm, berth_number: e.target.value})} className="input w-full">
              <option value="">— Любой доступный —</option>
              {AVAILABLE_BERTHS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Прикрепить документы</label>
            
            <input 
              ref={fileInputRef}
              type="file" 
              multiple 
              onChange={handleFileSelect} 
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-[#1a1a1a] border border-[#333] hover:border-purple-500 rounded-xl px-4 py-3 text-white transition-colors mb-4"
            >
              + Выбрать файлы
            </button>

            {selectedFiles.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3">
                    <span className="text-sm truncate">📎 {file.name}</span>
                    <button type="button" onClick={() => removeFile(index)} className="text-red-400 hover:text-red-500">
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Комментарий к заявке</label>
            <textarea 
              value={bookingForm.request_comment} 
              onChange={e => setBookingForm({...bookingForm, request_comment: e.target.value})} 
              className="input w-full h-24" 
              placeholder="Дополнительные пожелания..." 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || uploading} 
            className="btn btn-primary w-full py-4 text-lg font-medium disabled:opacity-70"
          >
            {loading || uploading ? 'Отправка...' : 'Отправить заявку на заход'}
          </button>
        </form>
      </div>
    </div>
  )
}