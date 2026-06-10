import React, { useState } from 'react'
import defaultAvatar from '../assets/defaultAvatar'

const PhotoUpload = ({ currentPhoto, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentPhoto || null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor seleciona uma imagem.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem deve ter menos de 2MB.')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'elos_profiles')
      formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await response.json()

      if (data.secure_url) {
        setPreview(data.secure_url)
        onUploadComplete(data.secure_url)
      } else {
        alert('Erro ao fazer upload. Tenta novamente.')
      }
    } catch (err) {
      console.error(err)
      alert('Erro ao fazer upload. Tenta novamente.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <img
          src={preview || defaultAvatar}
          alt="Foto de perfil"
          className="w-24 h-24 rounded-full object-cover border-2 border-green-400"
        />
        <label className="absolute bottom-0 right-0 bg-green-600 rounded-full p-1.5 cursor-pointer hover:bg-green-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
      {uploading && <p className="text-green-600 text-sm">A fazer upload...</p>}
      <p className="text-xs text-gray-400">Clica no icone para alterar a foto. Maximo 2MB.</p>
    </div>
  )
}

export default PhotoUpload