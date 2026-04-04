// src/pages/manager/News.tsx
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

type NewsItem = {
  id: string
  title: string
  content: string
  image_url: string | null
  created_at: string | null
  is_published: boolean | null
  created_by: string | null
  published_at: string | null
}

export default function ManagerNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)

  // Форма
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const fetchNews = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    else setNews(data || [])

    setLoading(false)
  }

  useEffect(() => {
    fetchNews()
  }, [])

  // Открытие формы редактирования
  const openEdit = (item: NewsItem) => {
    setEditingNews(item)
    setTitle(item.title)
    setContent(item.content)
    setImageUrl(item.image_url || '')
  }

  // Сброс формы
  const resetForm = () => {
    setEditingNews(null)
    setTitle('')
    setContent('')
    setImageUrl('')
  }

  const saveNews = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) return

    setSubmitting(true)

    if (editingNews) {
      // Редактирование
      const { error } = await supabase
        .from('news')
        .update({
          title,
          content,
          image_url: imageUrl.trim() || null,
        })
        .eq('id', editingNews.id)

      if (error) {
        alert('Ошибка при обновлении: ' + error.message)
      } else {
        alert('Новость успешно обновлена!')
        resetForm()
        fetchNews()
      }
    } else {
      // Создание новой
      const { error } = await supabase.from('news').insert({
        title,
        content,
        image_url: imageUrl.trim() || null,
        is_published: true,
      })

      if (error) {
        alert('Ошибка при публикации: ' + error.message)
      } else {
        alert('Новость успешно опубликована!')
        resetForm()
        fetchNews()
      }
    }

    setSubmitting(false)
  }

  const deleteNews = async (id: string, title: string) => {
    if (!confirm(`Вы уверены, что хотите удалить новость "${title}"?`)) return

    setDeletingId(id)

    const { error } = await supabase.from('news').delete().eq('id', id)

    if (error) {
      alert('Ошибка при удалении: ' + error.message)
    } else {
      alert('Новость удалена')
      setNews(news.filter(item => item.id !== id))
    }

    setDeletingId(null)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">Управление новостями</h1>
        <p className="text-gray-400 mt-2">Публикация и редактирование новостей для капитанов</p>
      </div>

      {/* Форма создания / редактирования */}
      <div className="bg-[#111] border border-[#222] rounded-3xl p-10 mb-12">
        <h2 className="text-2xl font-semibold mb-8">
          {editingNews ? 'Редактировать новость' : 'Опубликовать новую новость'}
        </h2>

        <form onSubmit={saveNews} className="space-y-8">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Заголовок новости</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input w-full text-lg"
              placeholder="Например: Открытие навигационного сезона 2026"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Ссылка на изображение (опционально)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="input w-full"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Текст новости</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="input w-full resize-y min-h-[240px]"
              placeholder="Подробное описание новости..."
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-medium py-4 rounded-2xl text-lg transition-all"
            >
              {submitting 
                ? (editingNews ? 'Сохранение...' : 'Публикация...') 
                : (editingNews ? 'Сохранить изменения' : 'Опубликовать новость')}
            </button>

            {editingNews && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 btn btn-secondary py-4 text-lg"
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Список новостей */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Опубликованные новости ({news.length})</h2>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Загрузка новостей...</div>
        ) : news.length === 0 ? (
          <div className="bg-[#111] border border-[#222] rounded-3xl p-16 text-center">
            <p className="text-xl text-gray-400">Пока нет опубликованных новостей</p>
          </div>
        ) : (
          <div className="space-y-8">
            {news.map((item) => (
              <div
                key={item.id}
                className="bg-[#111] border border-[#222] rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all"
              >
                {item.image_url && (
                  <div className="h-64 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-semibold text-white pr-8">{item.title}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('ru-RU') : '—'}
                    </span>
                  </div>

                  <p className="text-gray-300 leading-relaxed mb-6 line-clamp-4">
                    {item.content}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => openEdit(item)}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-2xl transition-all"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => deleteNews(item.id, item.title)}
                      disabled={deletingId === item.id}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white text-sm font-medium rounded-2xl transition-all"
                    >
                      {deletingId === item.id ? 'Удаление...' : 'Удалить'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}