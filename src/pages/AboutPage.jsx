import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const AboutPage = () => {
  const { t } = useLanguage()

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-600 mb-4">{t('aboutTitle')}</h1>
        <p className="text-gray-500 text-lg">{t('aboutSubtitle')}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('ourMission')}</h2>
        <p className="text-gray-600 leading-relaxed">{t('ourMissionText1')}</p>
        <p className="text-gray-600 leading-relaxed mt-4">{t('ourMissionText2')}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('howItWorks')}</h2>
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">1</span>
            <div>
              <h3 className="font-bold text-gray-800">{t('step1Title')}</h3>
              <p className="text-gray-600 text-sm mt-1">{t('step1Text')}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">2</span>
            <div>
              <h3 className="font-bold text-gray-800">{t('step2Title')}</h3>
              <p className="text-gray-600 text-sm mt-1">{t('step2Text')}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">3</span>
            <div>
              <h3 className="font-bold text-gray-800">{t('step3Title')}</h3>
              <p className="text-gray-600 text-sm mt-1">{t('step3Text')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 rounded-xl border border-green-200 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('whoCreated')}</h2>
        <p className="text-gray-600 leading-relaxed">{t('whoCreatedText')}</p>
      </div>

      <div className="text-center">
        <Link
          to="/register"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          {t('joinElos')}
        </Link>
      </div>

    </div>
  )
}

export default AboutPage