import { useState } from 'react'
import { uploadFile } from '../../features/documents/uploadFile'

export default function Documents() {
  const [file, setFile] = useState<File | null>(null)

  const handleUpload = async () => {
    if (!file) return
    await uploadFile(file)
    alert('Uploaded')
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Upload Documents</h1>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button className="bg-black text-white p-2 mt-2" onClick={handleUpload}>Upload</button>
    </div>
  )
}