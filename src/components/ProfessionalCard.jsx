import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import defaultAvatar from '../assets/defaultAvatar'

const ProfessionalCard = ({ id, name, area, type, languages, location, address, description, photo, openingHours }) => {
  const { t } = useLanguage()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-green-400 transition">

      <div className="flex items-center gap-4 mb-4">
        <img
          src={photo || defaultAvatar}
          alt={name}
          className="w-16 h-16 rounded-full object-cover border-2 border-green-400"
        />
        <div>
          <h3 className="text-lg font-bold text-gray-800">{name}</h3>
          <p className="text-green-600 font-semibold text-sm">{area}</p>
          <p className="text-gray-400 text-sm">{location || address}</p>
          {type === 'establishment' && (
            <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full mt-1">
              {t('establishments')}
            </span>
          )}
          {type === 'professional' && (
            <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full mt-1">
              {t('professionals')}
            </span>
          )}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>

      {openingHours && (
        <p className="text-gray-400 text-xs mb-3">Horario: {openingHours}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {languages && languages.map((lang) => (
          <span key={lang} className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
            {lang}
          </span>
        ))}
      </div>

      <Link
        to={`/professional/${id}`}
        className="block text-center bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
      >
        {t('viewProfile')}
      </Link>

    </div>
  )
}

export default ProfessionalCard