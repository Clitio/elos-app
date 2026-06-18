import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import gsap from 'gsap'

const NotFoundPage = () => {
  const { t } = useLanguage()
  const numberRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(numberRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }
    )
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' }
    )
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white px-6"
      style={{ background: 'linear-gradient(135deg, #009c3b 0%, #0d2b1a 50%, #169b62 100%)' }}
    >
      <div ref={numberRef} className="text-center mb-8">
        <h1 className="text-9xl font-black" style={{ textShadow: '0 0 40px rgba(255,255,255,0.2)' }}>
          404
        </h1>
        <div className="flex justify-center gap-2 mt-2">
          <div className="h-1 w-12 rounded-full bg-yellow-400"></div>
          <div className="h-1 w-12 rounded-full bg-white"></div>
          <div className="h-1 w-12 rounded-full" style={{ backgroundColor: '#169b62' }}></div>
        </div>
      </div>

      <div ref={contentRef} className="text-center opacity-0">
        <p className="text-2xl font-bold mb-2">Pagina nao encontrada</p>
        <p className="text-green-200 text-lg mb-10">
          Parece que te perdeste pelo caminho. Nao te preocupes, acontece!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-yellow-300 transition"
          >
            Voltar ao inicio
          </Link>
          <Link
            to="/directory"
            className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-gray-900 transition"
          >
            {t('directory')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage