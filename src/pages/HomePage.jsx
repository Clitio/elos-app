import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const HomePage = () => {
  const { t } = useLanguage()

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">{t('homeTitle')}</h1>
        <p className="text-xl mb-2">{t('homeSubtitle')}</p>
        <p className="text-lg mb-8 text-green-100">{t('homeDescription')}</p>
        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-50"
          >
            {t('registerButton')}
          </Link>
          <Link
            to="/directory"
            className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700"
          >
            {t('viewProfessionals')}
          </Link>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
          {t('whatAreYouLookingFor')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: t('health'), icon: '🏥', path: '/health' },
            { label: t('food'), icon: '🍽️', path: '/food' },
            { label: t('transport'), icon: '🚗', path: '/transport' },
            { label: t('beauty'), icon: '💇', path: '/beauty' },
            { label: t('accommodation'), icon: '🏠', path: '/accommodation' },
            { label: t('community'), icon: '🤝', path: '/community' },
            { label: t('dailyBasis'), icon: '📦', path: '/daily-basis' },
            { label: t('directory'), icon: '📋', path: '/directory' },
          ].map((cat) => (
            <Link
              key={cat.path}
              to={cat.path}
              className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-green-400 transition"
            >
              <span className="text-4xl mb-3">{cat.icon}</span>
              <span className="text-gray-700 font-semibold">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Missao */}
      <section className="bg-green-50 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('whyElos')}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">{t('whyElosDescription')}</p>
        <Link
          to="/about"
          className="inline-block mt-8 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700"
        >
          {t('learnMore')}
        </Link>
      </section>

      <footer className="text-center py-6 text-gray-400 text-sm">
        © 2025 Elos — {t('footer')}
      </footer>
    </div>
  )
}

export default HomePage