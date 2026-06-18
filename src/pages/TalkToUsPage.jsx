import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useLanguage } from '../context/LanguageContext'
import PageHeader from '../components/PageHeader'
import AnimatedSection from '../components/AnimatedSection'
import LoadingSpinner from '../components/LoadingSpinner'

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
      if (e.key === 'Enter') handleSubmit()
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
        headers: { 'Content-Type': 'application/json' },
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

  if (loading) return <LoadingSpinner />

  if (sent) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(135deg, #009c3b 0%, #0d2b1a 50%, #169b62 100%)' }}
      >
        <AnimatedSection direction="up" className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-black text-green-600 mb-2">{t('messageSent')}</h2>
            <p className="text-gray-500">{t('thankYou')}</p>
          </div>
        </AnimatedSection>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={t('talkToUsTitle')}
        subtitle={t('talkToUsSubtitle')}
        gradient="dark"
      />

      <div className="max-w-md mx-auto px-6 py-12">
        <AnimatedSection direction="up">
          <div className="bg-white rounded-3xl shadow-md p-8">

            {/* Info utilizador */}
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-6"
              style={{ background: 'linear-gradient(135deg, #009c3b20, #0d2b1a10)' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #009c3b, #0d2b1a)' }}
              >
                {userData?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{userData?.name}</p>
                <p className="text-xs text-gray-500">{userData?.email}</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('messageType')}</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm"
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
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={sending}
                className="w-full text-white py-4 rounded-2xl font-bold hover:opacity-90 transition shadow-lg disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #009c3b, #0d2b1a)' }}
              >
                {sending ? '...' : t('sendMessage')}
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

export default TalkToUsPage