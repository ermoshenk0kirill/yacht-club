// src/pages/captain/News.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function CaptainNews() {
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error)
        else setNews(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-white mb-2">Новости порта</h2>
        <p className="text-gray-400">Актуальная информация от администрации</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Загрузка новостей...</div>
      ) : news.length === 0 ? (
        <div className="bg-[#111] border border-[#222] rounded-3xl p-12 text-center">
          <p className="text-gray-400 text-lg">Пока нет опубликованных новостей.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-[#111] border border-[#222] rounded-3xl p-8 hover:border-purple-500/50 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {new Date(item.created_at).toLocaleDateString('ru-RU')}
                </span>
              </div>

              <p className="text-gray-300 leading-relaxed text-[17px]">
                {item.content}
              </p>

              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="mt-6 rounded-2xl w-full h-auto"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}