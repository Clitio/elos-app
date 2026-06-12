import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase'
import { useLanguage } from '../context/LanguageContext'
import defaultAvatar from '../assets/defaultAvatar'

const ProfessionalDetailsPage = () => {
  const { id } = useParams()
  const { t } = useLanguage()
  const [item, setItem] = useState(null)
  const [type, setType] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const profDoc = await getDoc(doc(db, 'professionals', id))
        if (profDoc.exists()) {
          setItem({ id: profDoc.id, ...profDoc.data() })
          setType('professional')
          setLoading(false)
          return
        }

        const estDoc = await getDoc(doc(db, 'establishments', id))
        if (estDoc.exists()) {
          setItem({ id: estDoc.id, ...estDoc.data() })
          setType('establishment')
          setLoading(false)
          return
        }

        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }

    fetchItem()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-lg">A carregar...</p>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">Perfil nao encontrado</h2>
        <Link to="/directory" className="text-green-600 hover:underline mt-4 inline-block">{t('backToDirectory')}</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link to="/directory" className="text-green-600 hover:underline text-sm mb-6 inline-block">{t('backToDirectory')}</Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">

        <div className="flex items-center gap-6 mb-6">
          <img
            src={item.photo || defaultAvatar}
            alt={item.name}
            className="w-24 h-24 rounded-full border-2 border-green-400 object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{item.name}</h1>
            <p className="text-green-600 font-semibold">{item.area || item.type}</p>
            <p className="text-gray-400 text-sm">{item.location || item.address}</p>
            <span className={`inline-block text-xs px-3 py-1 rounded-full mt-1 ${type === 'establishment' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
              {type === 'establishment' ? t('establishments') : t('professionals')}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-700 mb-2">{t('about_section')}</h2>
          <p className="text-gray-600">{item.description}</p>
        </div>

        {type === 'professional' && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-700 mb-2">Detalhes</h2>
            <p className="text-gray-600 text-sm">Anos na Irlanda: {item.yearsInIreland || 0}</p>
          </div>
        )}

        {type === 'establishment' && item.openingHours && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-700 mb-2">Horarios</h2>
            <div className="flex flex-col gap-1">
              {(() => {
                try {
                  const hours = JSON.parse(item.openingHours)
                  return Object.entries(hours).map(([day, time]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="text-gray-500 w-20">{day}</span>
                      <span className={time === 'fechado' ? 'text-red-400' : 'text-gray-700'}>{time}</span>
                    </div>
                  ))
                } catch {
                  return <p className="text-gray-600 text-sm">{item.openingHours}</p>
                }
              })()}
            </div>
          </div>
        )}

        {item.languages && item.languages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-700 mb-2">{t('languages')}</h2>
            <div className="flex flex-wrap gap-2">
              {item.languages.map((lang) => (
                <span key={lang} className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">{lang}</span>
              ))}
            </div>
          </div>
        )}

 <div className="border-t pt-6">
          <h2 className="text-lg font-bold text-gray-700 mb-2">{t('contact')}</h2>
          {user ? (
            <a 
              href={"mailto:" + item.email}
              className="block text-center bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {t('sendEmail')}
            </a>
          ) : (
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-3">{t('needAccountToContact')}</p>
              <Link
                to="/register"
                className="block bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                {t('createAccountButton')}
              </Link>
              <Link
                to="/login"
                className="block mt-2 border border-green-600 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
              >
                {t('alreadyHaveAccountButton')}
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default ProfessionalDetailsPage