// src/pages/manager/News.tsx
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ManagerNews() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const createNews = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) return

    setLoading(true)

    const { error } = await supabase.from('news').insert({
      title,
      content,
      is_published: true,
    })

    if (error) {
      alert('Ошибка: ' + error.message)
    } else {
      alert('Новость успешно опубликована!')
      setTitle('')
      setContent('')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-semibold mb-2">Публикация новости</h2>
        <p className="text-gray-400">Создайте новость для всех капитанов</p>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-3xl p-10">
        <form onSubmit={createNews} className="space-y-8">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Заголовок новости</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-2xl px-5 py-4 text-lg focus:outline-none focus:border-purple-500"
              placeholder="Например: Изменение графика работы порта"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Текст новости</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-3xl px-5 py-4 focus:outline-none focus:border-purple-500 resize-y min-h-[280px]"
              placeholder="Подробное описание..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-medium py-4 rounded-2xl text-lg transition-all"
          >
            {loading ? 'Публикация...' : 'Опубликовать новость'}
          </button>
        </form>
      </div>
    </div>
  )
}