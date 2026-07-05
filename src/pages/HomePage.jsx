import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HomePage = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const logoRef = useRef(null)
  const section1Ref = useRef(null)
  const section2Ref = useRef(null)
  const section3Ref = useRef(null)
  const section4Ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(logoRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 2, ease: 'power3.out' }
    )

    gsap.fromTo('.hero-text',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, delay: 1, ease: 'power3.out', stagger: 0.3 }
    )

    gsap.fromTo('.hero-buttons',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 2, ease: 'power3.out' }
    )

    gsap.fromTo(section1Ref.current,
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: section1Ref.current, start: 'top 80%' } }
    )

    gsap.fromTo(section2Ref.current,
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: section2Ref.current, start: 'top 80%' } }
    )

    gsap.fromTo(section3Ref.current,
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: section3Ref.current, start: 'top 80%' } }
    )

    gsap.fromTo('.category-card',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: section4Ref.current, start: 'top 80%' } }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div className="overflow-x-hidden">

      {/* HERO */}
      <section
        className="min-h-screen flex flex-col items-center justify-center text-white relative px-6"
        style={{ background: 'linear-gradient(135deg, #009c3b 0%, #1a6b2a 30%, #1a3a1a 50%, #1a3a6b 70%, #169b62 100%)' }}
      >
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #ffdf00, transparent)' }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #ff8c00, transparent)' }}></div>

        {/* Logo */}
        <div ref={logoRef} className="text-center mb-8">
          <h1 className="font-black tracking-widest" style={{
            fontSize: 'clamp(3rem, 15vw, 8rem)',
            textShadow: '0 0 40px rgba(255,255,255,0.3)'
          }}>
            ELOS
          </h1>
          <div className="flex justify-center gap-2 mt-2">
            <div className="h-1 w-16 rounded-full bg-yellow-400"></div>
            <div className="h-1 w-16 rounded-full bg-white"></div>
            <div className="h-1 w-16 rounded-full" style={{ backgroundColor: '#169b62' }}></div>
          </div>
        </div>

        {/* Textos */}
        <p className="hero-text text-center max-w-xl opacity-0" style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)' }}>
          {t('homeSubtitle')}
        </p>
        <p className="hero-text text-center max-w-lg mt-4 text-green-200 opacity-0" style={{ fontSize: 'clamp(0.85rem, 3vw, 1.1rem)' }}>
          {t('homeDescription')}
        </p>

        {/* Botoes */}
        <div className="hero-buttons flex flex-col sm:flex-row gap-4 mt-10 opacity-0 w-full max-w-sm sm:max-w-none sm:w-auto">
          <Link
            to="/register"
            className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition shadow-lg text-center"
          >
            {t('registerButton')}
          </Link>
          <Link
            to="/directory"
            className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-gray-900 transition text-center"
          >
            {t('viewProfessionals')}
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <svg className="w-6 h-6 text-white opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* SECAO 1 — O que e o Elos */}
      <section className="min-h-screen flex items-center px-6 md:px-20 py-20 bg-white">
        <div ref={section1Ref} className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center opacity-0">
          <div>
            <span className="text-sm font-bold text-green-600 uppercase tracking-widest">O que é o Elos</span>
            <h2 className="font-black text-gray-900 mt-4 leading-tight" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>
              {t('whyElos')}
            </h2>
            <p className="text-gray-600 text-lg mt-6 leading-relaxed">{t('whyElosDescription')}</p>
            <Link
              to="/about"
              className="inline-block mt-8 bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 transition"
            >
              {t('learnMore')}
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="w-48 h-48 md:w-80 md:h-80 rounded-full flex items-center justify-center shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #009c3b, #ffdf00)', fontSize: 'clamp(4rem, 10vw, 6rem)' }}>
              🤝
            </div>
          </div>
        </div>
      </section>

      {/* SECAO 2 — Como funciona */}
      <section className="min-h-screen flex items-center px-6 md:px-20 py-20" style={{ background: '#0d2b1a' }}>
        <div ref={section2Ref} className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center opacity-0">
          <div className="flex justify-center order-2 md:order-1">
            <div className="flex flex-col gap-6 w-full max-w-sm">
              {[
                { num: '01', title: t('step1Title'), text: t('step1Text'), color: '#ffdf00' },
                { num: '02', title: t('step2Title'), text: t('step2Text'), color: '#009c3b' },
                { num: '03', title: t('step3Title'), text: t('step3Text'), color: '#169b62' },
              ].map((step) => (
                <div key={step.num} className="flex items-start gap-4">
                  <span className="text-3xl font-black shrink-0" style={{ color: step.color }}>{step.num}</span>
                  <div>
                    <h3 className="text-white font-bold text-lg">{step.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#ffdf00' }}>Como funciona</span>
            <h2 className="font-black text-white mt-4 leading-tight" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>
              {t('howItWorks')}
            </h2>
            <p className="text-gray-400 text-lg mt-6 leading-relaxed">
              Simples, rápido e em português. Encontre quem você precisa em poucos cliques.
            </p>
          </div>
        </div>
      </section>

      {/* SECAO 3 — Quem somos */}
      <section className="min-h-screen flex items-center px-6 md:px-20 py-20" style={{ background: '#ffdf00' }}>
        <div ref={section3Ref} className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center opacity-0">
          <div>
            <span className="text-sm font-bold text-green-800 uppercase tracking-widest">A nossa história</span>
            <h2 className="font-black text-gray-900 mt-4 leading-tight" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>
              {t('whoCreated')}
            </h2>
            <p className="text-gray-800 text-lg mt-6 leading-relaxed">{t('whoCreatedText')}</p>
            <Link
              to="/register"
              className="inline-block mt-8 bg-gray-900 text-yellow-400 px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition"
            >
              {t('joinElos')}
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="w-48 h-48 md:w-80 md:h-80 rounded-full flex items-center justify-center shadow-2xl bg-green-800"
              style={{ fontSize: 'clamp(4rem, 10vw, 6rem)' }}>
              🇧🇷
            </div>
          </div>
        </div>
      </section>

      {/* SECAO 4 — Categorias */}
      <section ref={section4Ref} className="flex flex-col items-center justify-center px-6 py-20 bg-gray-50">
        <div className="text-center mb-12">
          <span className="text-sm font-bold text-green-600 uppercase tracking-widest">Serviços</span>
          <h2 className="font-black text-gray-900 mt-4" style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)' }}>
            {t('whatAreYouLookingFor')}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl w-full">
          {[
            { label: t('health'), icon: '🏥', path: '/health', color: 'from-green-400 to-green-600' },
            { label: t('food'), icon: '🍽️', path: '/food', color: 'from-yellow-400 to-orange-500' },
            { label: t('transport'), icon: '🚗', path: '/transport', color: 'from-blue-400 to-blue-600' },
            { label: t('beauty'), icon: '💇', path: '/beauty', color: 'from-pink-400 to-pink-600' },
            { label: t('accommodation'), icon: '🏠', path: '/accommodation', color: 'from-purple-400 to-purple-600' },
            { label: t('community'), icon: '🤝', path: '/community', color: 'from-green-600 to-green-800' },
            { label: t('dailyBasis'), icon: '📦', path: '/daily-basis', color: 'from-orange-400 to-red-500' },
            { label: t('directory'), icon: '📋', path: '/directory', color: 'from-gray-600 to-gray-800' },
          ].map((cat) => (
            <Link
              key={cat.path}
              to={cat.path}
              className={`category-card flex flex-col items-center justify-center bg-gradient-to-br ${cat.color} rounded-2xl p-5 md:p-8 shadow-lg hover:scale-105 transition-transform opacity-0`}
            >
              <span className="mb-2 md:mb-4" style={{ fontSize: 'clamp(2rem, 8vw, 3rem)' }}>{cat.icon}</span>
              <span className="text-white font-bold text-center text-sm md:text-base">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 text-center" style={{ background: '#0d2b1a' }}>
        <h2 className="text-4xl font-black text-white mb-2">ELOS</h2>
        <div className="flex justify-center gap-2 mb-6">
          <div className="h-1 w-12 rounded-full bg-yellow-400"></div>
          <div className="h-1 w-12 rounded-full bg-white"></div>
          <div className="h-1 w-12 rounded-full" style={{ backgroundColor: '#169b62' }}></div>
        </div>
        <p className="text-yellow-400 font-semibold text-lg mb-2">{t('footer')}</p>
        <p className="text-gray-500 text-sm mb-8">Cork, Ireland 🇮🇪 × Brazil 🇧🇷</p>
        <div className="flex flex-wrap justify-center gap-6 text-sm mb-8">
          <Link to="/about" className="text-gray-400 hover:text-white transition">{t('about')}</Link>
          <Link to="/directory" className="text-gray-400 hover:text-white transition">{t('directory')}</Link>
          <Link to="/register" className="text-gray-400 hover:text-white transition">{t('register')}</Link>
          <Link to="/talk-to-us" className="text-gray-400 hover:text-white transition">{t('talkToUs')}</Link>
        </div>
        <p className="text-gray-600 text-xs">© 2025 Elos. Cork, Ireland.</p>
      </footer>

    </div>
  )
}

export default HomePage