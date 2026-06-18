import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase'
import { useLanguage } from '../context/LanguageContext'
import AnimatedSection from '../components/AnimatedSection'
import LoadingSpinner from '../components/LoadingSpinner'
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

  if (loading) return <LoadingSpinner />

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #009c3b 0%, #0d2b1a 50%, #169b62 100%)' }}
      >
        <p className="text-white text-2xl font-bold mb-4">Perfil nao encontrado</p>
        <Link to="/directory" className="bg-white text-green-700 px-6 py-3 rounded-full font-bold hover:bg-green-50 transition">
          {t('backToDirectory')}
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header com foto */}
      <div
        className="py-16 px-6 text-white relative overflow-hidden"
        style={{ background: type === 'establishment'
          ? 'linear-gradient(135deg, #1a3a6b, #0d2b1a)'
          : 'linear-gradient(135deg, #009c3b, #0d2b1a)'
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10"
          style={{ background: 'radial-gradient(circle at 70% 50%, #ffdf00, transparent 60%)' }}
        ></div>
        <div className="max-w-2xl mx-auto relative z-10">
          <Link to="/directory" className="text-green-200 hover:text-white text-sm mb-6 inline-block transition">
            ← {t('backToDirectory')}
          </Link>
          <div className="flex items-center gap-6 mt-4">
            <img
              src={item.photo || defaultAvatar}
              alt={item.name}
              className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl object-cover"
            />
            <div>
              <h1 className="text-3xl font-black">{item.name}</h1>
              <p className="text-green-200 font-semibold mt-1">{item.area || item.type}</p>
              <p className="text-green-300 text-sm mt-1">📍 {item.location || item.address}</p>
              <span className={`inline-block text-xs px-3 py-1 rounded-full mt-2 font-semibold ${
                type === 'establishment' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {type === 'establishment' ? t('establishments') : t('professionals')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Sobre */}
        <AnimatedSection direction="up">
          <div className="bg-white rounded-3xl shadow-md p-8 mb-6">
            <h2 className="text-lg font-black text-gray-800 mb-3">{t('about_section')}</h2>
            <p className="text-gray-600 leading-relaxed">{item.description}</p>
          </div>
        </AnimatedSection>

        {/* Detalhes profissional */}
        {type === 'professional' && (
          <AnimatedSection direction="up" delay={0.1}>
            <div className="bg-gray-50 rounded-3xl p-6 mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('yearsInIrelandLabel')}</p>
              <p className="text-gray-700 font-bold text-lg mt-1">{item.yearsInIreland || 0} {t('year')}</p>
            </div>
          </AnimatedSection>
        )}

        {/* Horarios estabelecimento */}
        {type === 'establishment' && item.openingHours && (
          <AnimatedSection direction="up" delay={0.1}>
            <div className="bg-white rounded-3xl shadow-md p-8 mb-6">
              <h2 className="text-lg font-black text-gray-800 mb-4">{t('openingHours')}</h2>
              <div className="flex flex-col gap-2">
                {(() => {
                  try {
                    const hours = JSON.parse(item.openingHours)
                    return Object.entries(hours).map(([day, time]) => (
                      <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-500 font-semibold text-sm">{day}</span>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                          time === 'fechado'
                            ? 'bg-red-100 text-red-500'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {time === '00:00-00:00' ? '24h' : time}
                        </span>
                      </div>
                    ))
                  } catch {
                    return <p className="text-gray-600 text-sm">{item.openingHours}</p>
                  }
                })()}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Idiomas */}
        {item.languages && item.languages.length > 0 && (
          <AnimatedSection direction="up" delay={0.2}>
            <div className="bg-white rounded-3xl shadow-md p-8 mb-6">
              <h2 className="text-lg font-black text-gray-800 mb-4">{t('languages')}</h2>
              <div className="flex flex-wrap gap-2">
                {item.languages.map((lang) => (
                  <span key={lang} className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Contacto */}
        <AnimatedSection direction="up" delay={0.3}>
          <div className="bg-white rounded-3xl shadow-md p-8">
            <h2 className="text-lg font-black text-gray-800 mb-4">{t('contact')}</h2>
            {user ? (
              <a 
                href={"mailto:" + item.email}
                className="block text-center text-white py-4 rounded-2xl font-bold hover:opacity-90 transition shadow-lg"
                style={{ background: 'linear-gradient(135deg, #009c3b, #0d2b1a)' }}
              >
                {t('sendEmail')}
              </a>
            ) : (
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-4">{t('needAccountToContact')}</p>
                <Link
                  to="/register"
                  className="block text-white py-4 rounded-2xl font-bold hover:opacity-90 transition shadow-lg mb-3"
                  style={{ background: 'linear-gradient(135deg, #009c3b, #0d2b1a)' }}
                >
                  {t('createAccountButton')}
                </Link>
                <Link
                  to="/login"
                  className="block border-2 border-green-600 text-green-600 py-4 rounded-2xl font-bold hover:bg-green-50 transition"
                >
                  {t('alreadyHaveAccountButton')}
                </Link>
              </div>
            )}
          </div>
        </AnimatedSection>

      </div>
    </div>
  )
}

export default ProfessionalDetailsPage