import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import PageHeader from '../components/PageHeader'
import AnimatedSection from '../components/AnimatedSection'

const AboutPage = () => {
  const { t } = useLanguage()

  return (
    <div>
      <PageHeader
        title={t('aboutTitle')}
        subtitle={t('aboutSubtitle')}
        gradient="dark"
      />

      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Missao */}
        <AnimatedSection direction="left">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-8 mb-8">
            <h2 className="text-2xl font-black text-gray-800 mb-4">{t('ourMission')}</h2>
            <p className="text-gray-600 leading-relaxed">{t('ourMissionText1')}</p>
            <p className="text-gray-600 leading-relaxed mt-4">{t('ourMissionText2')}</p>
          </div>
        </AnimatedSection>

        {/* Como funciona */}
        <AnimatedSection direction="right">
          <div className="rounded-3xl p-8 mb-8 text-white" style={{ background: 'linear-gradient(135deg, #0d2b1a, #1a3a6b)' }}>
            <h2 className="text-2xl font-black mb-6">{t('howItWorks')}</h2>
            <div className="flex flex-col gap-6">
              {[
                { num: '01', title: t('step1Title'), text: t('step1Text'), color: '#ffdf00' },
                { num: '02', title: t('step2Title'), text: t('step2Text'), color: '#009c3b' },
                { num: '03', title: t('step3Title'), text: t('step3Text'), color: '#169b62' },
              ].map((step) => (
                <div key={step.num} className="flex items-start gap-4">
                  <span className="text-3xl font-black shrink-0" style={{ color: step.color }}>{step.num}</span>
                  <div>
                    <h3 className="font-bold text-lg">{step.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Quem criou */}
        <AnimatedSection direction="left">
          <div className="rounded-3xl p-8 mb-8" style={{ background: 'linear-gradient(135deg, #ffdf00, #ff8c00)' }}>
            <h2 className="text-2xl font-black text-gray-900 mb-4">{t('whoCreated')}</h2>
            <p className="text-gray-800 leading-relaxed">{t('whoCreatedText')}</p>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection direction="up">
          <div className="text-center">
            <Link
              to="/register"
              className="inline-block text-white px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 transition shadow-lg"
              style={{ background: 'linear-gradient(135deg, #009c3b, #0d2b1a)' }}
            >
              {t('joinElos')}
            </Link>
          </div>
        </AnimatedSection>

      </div>
    </div>
  )
}

export default AboutPage