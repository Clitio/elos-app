import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HomePage = () => {
  const { t } = useLanguage()
  const logoRef = useRef(null)
  const heroRef = useRef(null)
  const section1Ref = useRef(null)
  const section2Ref = useRef(null)
  const section3Ref = useRef(null)
  const section4Ref = useRef(null)

  useEffect(() => {
    // Logo aparece lentamente
    gsap.fromTo(logoRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 2, ease: 'power3.out' }
    )

    // Subtitulo aparece depois do logo
    gsap.fromTo('.hero-text',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, delay: 1, ease: 'power3.out', stagger: 0.3 }
    )

    // Botoes aparecem por ultimo
    gsap.fromTo('.hero-buttons',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 2, ease: 'power3.out' }
    )

    // Secao 1 — da esquerda
    gsap.fromTo(section1Ref.current,
      { opacity: 0, x: -100 },
      {
        opacity: 1, x: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: section1Ref.current, start: 'top 80%' }
      }
    )

    // Secao 2 — da direita
    gsap.fromTo(section2Ref.current,
      { opacity: 0, x: 100 },
      {
        opacity: 1, x: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: section2Ref.current, start: 'top 80%' }
      }
    )

    // Secao 3 — da esquerda
    gsap.fromTo(section3Ref.current,
      { opacity: 0, x: -100 },
      {
        opacity: 1, x: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: section3Ref.current, start: 'top 80%' }
      }
    )

    // Secao 4 — cards aparecem um a um
    gsap.fromTo('.category-card',
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: section4Ref.current, start: 'top 80%' }
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div className="overflow-x-hidden">

      {/* HERO — tela inteira com gradiente Brasil + Irlanda */}
      <section
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center text-white relative"
        style={{
          background: 'linear-gradient(135deg, #009c3b 0%, #1a6b2a 30%, #1a3a1a 50%, #1a3a6b 70%, #169b62 100%)'
        }}
      >
        {/* Circulos decorativos de fundo */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #ffdf00, transparent)' }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #ff8c00, transparent)' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #ffffff, transparent)' }}></div>

        {/* Logo */}
        <div ref={logoRef} className="text-center mb-8">
          <h1 className="text-8xl font-black tracking-widest" style={{ textShadow: '0 0 40px rgba(255,255,255,0.3)' }}>
            ELOS
          </h1>
          <div className="flex justify-center gap-2 mt-2">
            <div className="h-1 w-16 rounded-full bg-yellow-400"></div>
            <div className="h-1 w-16 rounded-full bg-white"></div>
            <div className="h-1 w-16 rounded-full" style={{ backgroundColor: '#169b62' }}></div>
          </div>
        </div>

        {/* Textos */}
        <p className="hero-text text-2xl font-light text-center max-w-xl px-6 opacity-0">
          {t('homeSubtitle')}
        </p>
        <p className="hero-text text-lg text-center max-w-lg px-6 mt-4 text-green-200 opacity-0">
          {t('homeDescription')}
        </p>

        {/* Barra de pesquisa */}
        <div className="hero-buttons w-full max-w-2xl px-6 mt-10 opacity-0">
          <div className="bg-white rounded-2xl shadow-2xl p-2 flex gap-2">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="flex-1 px-4 py-3 text-gray-800 rounded-xl focus:outline-none text-lg"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  window.location.href = `/search?q=${e.target.value}`
                }
              }}
            />
            <Link
              to="/search"
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition text-lg"
            >
              {t('search')}
            </Link>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <Link to="/health" className="text-green-200 text-sm hover:text-white transition">{t('health')}</Link>
            <span className="text-green-400">·</span>
            <Link to="/food" className="text-green-200 text-sm hover:text-white transition">{t('food')}</Link>
            <span className="text-green-400">·</span>
            <Link to="/transport" className="text-green-200 text-sm hover:text-white transition">{t('transport')}</Link>
            <span className="text-green-400">·</span>
            <Link to="/beauty" className="text-green-200 text-sm hover:text-white transition">{t('beauty')}</Link>
            <span className="text-green-400">·</span>
            <Link to="/directory" className="text-green-200 text-sm hover:text-white transition">{t('directory')}</Link>
          </div>
      </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <svg className="w-6 h-6 text-white opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* SECAO 1 — O que e o Elos — fundo branco, texto esquerda */}
      <section className="min-h-screen flex items-center px-8 md:px-20 py-20 bg-white">
        <div ref={section1Ref} className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center opacity-0">
          <div>
            <span className="text-sm font-bold text-green-600 uppercase tracking-widest">O que e o Elos</span>
            <h2 className="text-5xl font-black text-gray-900 mt-4 leading-tight">{t('whyElos')}</h2>
            <p className="text-gray-600 text-lg mt-6 leading-relaxed">{t('whyElosDescription')}</p>
            <Link
              to="/about"
              className="inline-block mt-8 bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 transition"
            >
              {t('learnMore')}
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="w-80 h-80 rounded-full flex items-center justify-center text-9xl shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #009c3b, #ffdf00)' }}>
              🤝
            </div>
          </div>
        </div>
      </section>

      {/* SECAO 2 — Como funciona — fundo verde escuro, texto direita */}
      <section className="min-h-screen flex items-center px-8 md:px-20 py-20" style={{ background: '#0d2b1a' }}>
        <div ref={section2Ref} className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center opacity-0">
          <div className="flex justify-center order-2 md:order-1">
            <div className="flex flex-col gap-6">
              {[
                { num: '01', title: t('step1Title'), text: t('step1Text'), color: '#ffdf00' },
                { num: '02', title: t('step2Title'), text: t('step2Text'), color: '#009c3b' },
                { num: '03', title: t('step3Title'), text: t('step3Text'), color: '#169b62' },
              ].map((step) => (
                <div key={step.num} className="flex items-start gap-4">
                  <span className="text-4xl font-black" style={{ color: step.color }}>{step.num}</span>
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
            <h2 className="text-5xl font-black text-white mt-4 leading-tight">{t('howItWorks')}</h2>
            <p className="text-gray-400 text-lg mt-6 leading-relaxed">
              Simples, rapido e em portugues. Encontra quem precisas em poucos cliques.
            </p>
          </div>
        </div>
      </section>

      {/* SECAO 3 — Quem somos — fundo amarelo brasileiro, texto esquerda */}
      <section className="min-h-screen flex items-center px-8 md:px-20 py-20" style={{ background: '#ffdf00' }}>
        <div ref={section3Ref} className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center opacity-0">
          <div>
            <span className="text-sm font-bold text-green-800 uppercase tracking-widest">A nossa historia</span>
            <h2 className="text-5xl font-black text-gray-900 mt-4 leading-tight">{t('whoCreated')}</h2>
            <p className="text-gray-800 text-lg mt-6 leading-relaxed">{t('whoCreatedText')}</p>
            <Link
              to="/register"
              className="inline-block mt-8 bg-gray-900 text-yellow-400 px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition"
            >
              {t('joinElos')}
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="w-80 h-80 rounded-full flex items-center justify-center text-9xl shadow-2xl bg-green-800">
              🇧🇷
            </div>
          </div>
        </div>
      </section>

      {/* SECAO 4 — Categorias — fundo branco */}
      <section ref={section4Ref} className="min-h-screen flex flex-col items-center justify-center px-8 py-20 bg-gray-50">
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-green-600 uppercase tracking-widest">Servicos</span>
          <h2 className="text-5xl font-black text-gray-900 mt-4">{t('whatAreYouLookingFor')}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl w-full">
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
              className={`category-card flex flex-col items-center justify-center bg-gradient-to-br ${cat.color} rounded-2xl p-8 shadow-lg hover:scale-105 transition-transform opacity-0`}
            >
              <span className="text-5xl mb-4">{cat.icon}</span>
              <span className="text-white font-bold text-center">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-8 text-center" style={{ background: '#0d2b1a' }}>
        <h2 className="text-4xl font-black text-white mb-2">ELOS</h2>
        <div className="flex justify-center gap-2 mb-4">
          <div className="h-1 w-12 rounded-full bg-yellow-400"></div>
          <div className="h-1 w-12 rounded-full bg-white"></div>
          <div className="h-1 w-12 rounded-full" style={{ backgroundColor: '#169b62' }}></div>
        </div>
        <p className="text-yellow-400 font-semibold text-lg mb-2">{t('footer')}</p>
        <p className="text-gray-500 text-sm mb-8">Cork, Ireland 🇮🇪 × Brazil 🇧🇷</p>
        <div className="flex justify-center gap-8 text-sm mb-8">
          <Link to="/about" className="text-gray-400 hover:text-white transition">{t('about')}</Link>
          <Link to="/directory" className="text-gray-400 hover:text-white transition">{t('directory')}</Link>
          <Link to="/register" className="text-gray-400 hover:text-white transition">{t('register')}</Link>
          <Link to="/talk-to-us" className="text-gray-400 hover:text-white transition">{t('talkToUs')}</Link>
        </div>
        <p className="text-gray-600 text-xs">© 2025 Elos. {t('footer')}</p>
      </footer>
    </div>
  )
}

export default HomePage