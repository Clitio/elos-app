import React from 'react'

const availableLanguages = [
  'Portugues', 'Ingles', 'Espanhol', 'Frances',
  'Italiano', 'Alemao', 'Mandarim', 'Arabe', 'Russo'
]

const LanguageSelector = ({ selected, onChange }) => {
  const toggle = (lang) => {
    if (selected.includes(lang)) {
      onChange(selected.filter((l) => l !== lang))
    } else {
      onChange([...selected, lang])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {availableLanguages.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => toggle(lang)}
          className={`text-sm px-3 py-1 rounded-full border transition ${
            selected.includes(lang)
              ? 'bg-green-600 text-white border-green-600'
              : 'border-gray-300 text-gray-600 hover:border-green-400'
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  )
}

export default LanguageSelector