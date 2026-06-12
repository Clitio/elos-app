import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useLanguage } from '../context/LanguageContext'

const TalkToUsPage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [type, setType] = useState('suggestion')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/login')
        return
      }
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
      if (userDoc.exists()) {
        setUserData({ ...userDoc.data(), email: currentUser.email })
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [navigate])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleSubmit()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [message, type])

  const handleSubmit = async () => {
    if (!message) {
      setError('Por favor escreve uma mensagem!')
      return
    }

    setSending(true)
    setError('')

    try {
      const response = await fetch(import.meta.env.VITE_FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: type === 'suggestion' ? t('suggestion') : t('report'),
          name: userData?.name,
          email: userData?.email,
          message: message,
        }),
      })

      if (response.ok) {
        setSent(true)
      } else {
        setError('Erro ao enviar mensagem. Tenta novamente.')
      }
    } catch (err) {
      setError('Erro ao enviar mensagem. Tenta novamente.')
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-lg">A carregar...</p>
      </div>
    )
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 w-full max-w-md text-center">
          <div className="text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">{t('messageSent')}</h2>
          <p className="text-gray-500">{t('thankYou')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">{t('talkToUsTitle')}</h1>
          <p className="text-gray-500 mt-2">{t('talkToUsSubtitle')}</p>
        </div>

        <div className="flex items-center gap-3 bg-green-50 rounded-lg px-4 py-3 mb-6">
          <div>
            <p className="text-sm font-semibold text-gray-800">{userData?.name}</p>
            <p className="text-xs text-gray-500">{userData?.email}</p>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('messageType')}</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400"
            >
              <option value="suggestion">{t('suggestion')}</option>
              <option value="report">{t('report')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('message')}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('message') + '...'}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={sending}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition mt-2 disabled:opacity-50"
          >
            {sending ? '...' : t('sendMessage')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TalkToUsPage