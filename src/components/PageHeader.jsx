import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

const gradients = {
  green: 'linear-gradient(135deg, #009c3b 0%, #0d2b1a 50%, #169b62 100%)',
  blue: 'linear-gradient(135deg, #1a3a6b 0%, #0d1b2a 50%, #169b62 100%)',
  yellow: 'linear-gradient(135deg, #ffdf00 0%, #ff8c00 50%, #009c3b 100%)',
  dark: 'linear-gradient(135deg, #0d2b1a 0%, #1a1a1a 50%, #0d2b1a 100%)',
}

const PageHeader = ({ title, subtitle, gradient = 'green' }) => {
  const headerRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )
  }, [])

  return (
    <div
      className="py-20 px-6 text-center text-white relative overflow-hidden"
      style={{ background: gradients[gradient] }}
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-10"
        style={{ background: 'radial-gradient(circle at 30% 50%, #ffdf00, transparent 60%)' }}
      ></div>
      <div ref={headerRef} className="relative z-10">
        <h1 className="text-5xl font-black mb-4" style={{ textShadow: '0 0 30px rgba(255,255,255,0.2)' }}>
          {title}
        </h1>
        {subtitle && <p className="text-lg text-green-200 max-w-xl mx-auto">{subtitle}</p>}
        <div className="flex justify-center gap-2 mt-6">
          <div className="h-1 w-10 rounded-full bg-yellow-400"></div>
          <div className="h-1 w-10 rounded-full bg-white"></div>
          <div className="h-1 w-10 rounded-full" style={{ backgroundColor: '#169b62' }}></div>
        </div>
      </div>
    </div>
  )
}

export default PageHeader