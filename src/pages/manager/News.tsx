import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ManagerNews() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const create = async () => {
    await supabase.from('news').insert({
      title,
      content,
      is_published: true
    })
  }

  return (
    <div>
      <h1>News</h1>
      <input placeholder="title" onChange={e => setTitle(e.target.value)} />
      <textarea onChange={e => setContent(e.target.value)} />
      <button onClick={create}>Create</button>
    </div>
  )
}
