import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import AnimatedSection from '../components/AnimatedSection'

const SuccessPage = () => {
  const { t } = useLanguage()

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #009c3b 0%, #0d2b1a 50%, #169b62 100%)' }}
    >
      <AnimatedSection direction="up" className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">

          <div className="text-7xl mb-6">🎉</div>

          <h1 className="text-3xl font-black mb-2" style={{
            background: 'linear-gradient(135deg, #009c3b, #0d2b1a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {t('welcomeToElos')}
          </h1>

          <div className="flex justify-center gap-2 my-4">
            <div className="h-1 w-8 rounded-full bg-yellow-400"></div>
            <div className="h-1 w-8 rounded-full bg-green-600"></div>
            <div className="h-1 w-8 rounded-full" style={{ backgroundColor: '#169b62' }}></div>
          </div>

          <p className="text-gray-500 mb-8">{t('accountCreated')}</p>

          <div className="flex flex-col gap-3">
            <Link
              to="/directory"
              className="block text-white py-4 rounded-2xl font-bold hover:opacity-90 transition shadow-lg"
              style={{ background: 'linear-gradient(135deg, #009c3b, #0d2b1a)' }}
            >
              {t('viewProfessionalsButton')}
            </Link>
            <Link
              to="/dashboard"
              className="block border-2 border-green-600 text-green-600 py-4 rounded-2xl font-bold hover:bg-green-50 transition"
            >
              {t('myProfileButton')}
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}

export default SuccessPage