import React, { createContext, useContext, useState } from 'react'
import translations from '../utils/translations'

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('pt')

  const t = (key) => translations[language][key] || key

  const toggleLanguage = () => {
    setLanguage((prev) => prev === 'pt' ? 'en' : 'pt')
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)