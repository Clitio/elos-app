import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import defaultAvatar from '../assets/defaultAvatar'

const ProfessionalCard = ({ id, name, area, profileType, languages, location, address, description, photo, businessType }) => {
  const { t } = useLanguage()

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      <div
        className="h-24 relative"
        style={{ background: profileType === 'establishment'
          ? 'linear-gradient(135deg, #1a3a6b, #169b62)'
          : 'linear-gradient(135deg, #009c3b, #0d2b1a)'
        }}
      >
        <div className="absolute -bottom-8 left-6">
          <img
            src={photo || defaultAvatar}
            alt={name}
            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
          />
        </div>
        <div className="absolute top-3 right-3">
          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
            profileType === 'establishment'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {profileType === 'establishment' ? t('establishments') : t('professionals')}
          </span>
        </div>
      </div>

      <div className="pt-10 px-6 pb-6">
        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
        <p className="text-green-600 font-semibold text-sm">{area || businessType}</p>
        <p className="text-gray-400 text-sm mt-1">📍 {location || address}</p>
        <p className="text-gray-600 text-sm mt-3 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-1 mt-3">
          {languages && languages.slice(0, 3).map((lang) => (
            <span key={lang} className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-200">
              {lang}
            </span>
          ))}
        </div>
        <Link
          to={`/professional/${id}`}
          className="block text-center mt-4 bg-gradient-to-r from-green-600 to-green-800 text-white py-2.5 rounded-xl text-sm font-semibold hover:from-green-700 hover:to-green-900 transition"
        >
          {t('viewProfile')}
        </Link>
      </div>
    </div>
  )
}

export default ProfessionalCard