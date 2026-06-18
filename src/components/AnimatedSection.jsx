import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const AnimatedSection = ({ children, direction = 'up', delay = 0, className = '' }) => {
  const ref = useRef(null)

  const from = {
    up: { opacity: 0, y: 60 },
    down: { opacity: 0, y: -60 },
    left: { opacity: 0, x: -60 },
    right: { opacity: 0, x: 60 },
    fade: { opacity: 0 },
  }

  useEffect(() => {
    gsap.fromTo(ref.current,
      from[direction],
      {
        opacity: 1, x: 0, y: 0, duration: 0.8, delay, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' }
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div ref={ref} className={`opacity-0 ${className}`}>
      {children}
    </div>
  )
}

export default AnimatedSection