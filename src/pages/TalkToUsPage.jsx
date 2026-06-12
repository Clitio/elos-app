import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const TalkToUsPage = () => {
  const navigate = useNavigate()
  const [type, setType] = useState('suggestion')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  // ADICIONA AQUI
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleSubmit()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [message, type])

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
          type: type === 'suggestion' ? 'Sugestao' : 'Relatorio de problema',
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
          <h2 className="text-2xl font-bold text-green-600 mb-2">Mensagem enviada!</h2>
          <p className="text-gray-500">Obrigado pelo teu feedback. Vamos analisar em breve.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">Fala Connosco</h1>
          <p className="text-gray-500 mt-2">Sugestoes ou relatorios, estamos a ouvir</p>
        </div>

        {/* Info do utilizador logado */}
        <div className="flex items-center gap-3 bg-green-50 rounded-lg px-4 py-3 mb-6">
          <div>
            <p className="text-sm font-semibold text-gray-800">{userData?.name}</p>
            <p className="text-xs text-gray-500">{userData?.email}</p>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <div className="flex flex-col gap-4">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de mensagem</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400"
            >
              <option value="suggestion">Sugestao</option>
              <option value="report">Relatorio de problema</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mensagem</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreve aqui a tua mensagem..."
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={sending}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition mt-2 disabled:opacity-50"
          >
            {sending ? 'A enviar...' : 'Enviar Mensagem'}
          </button>

        </div>
      </div>
    </div>
  )
}

export default TalkToUsPage