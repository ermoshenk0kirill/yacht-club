import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Home() {
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .then(({ data, error }) => {
        if (error) console.error('Supabase error:', error)
        setNews(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-purple-400">Yacht Port System</h1>
        <p className="text-xl text-gray-400 mb-12">Добро пожаловать в систему управления яхт-портом</p>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-6">Новости порта</h2>
          
          {loading ? (
            <p className="text-gray-500">Загрузка...</p>
          ) : news.length === 0 ? (
            <p className="text-gray-500 text-lg">Пока нет опубликованных новостей.</p>
          ) : (
            news.map((n) => (
              <div key={n.id} className="border-l-4 border-purple-500 pl-6 mb-8">
                <h3 className="text-2xl font-bold mb-2">{n.title}</h3>
                <p className="text-gray-300 leading-relaxed">{n.content}</p>
              </div>
            ))
          )}
        </div>

        <div className="mt-12 text-center text-gray-500">
          Попробуй перейти по ссылкам: /login или /register
        </div>
      </div>
    </div>
  )
}