import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithPopup, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { useLanguage } from '../context/LanguageContext'
import AnimatedSection from '../components/AnimatedSection'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

const LoginPage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') handleEmailLogin()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [email, password])

const checkIfBanned = async (email) => {
  const emailKey = email.replace(/\./g, '_').replace(/@/g, '_at_')
  const bannedDoc = await getDoc(doc(db, 'bannedEmails', emailKey))
  return bannedDoc.exists()
}

const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const banned = await checkIfBanned(result.user.email)
    if (banned) {
      await signOut(auth)
      setError('Esta conta foi banida. Entre em contato pelo Fale Conosco se achar que foi um engano.')
      return
    }
    navigate('/dashboard')
  } catch (err) {
    setError('Erro ao fazer login com Google. Tenta novamente.')
    console.error(err)
  }
}

const handleEmailLogin = async () => {
  if (!email || !password) {
    setError('Por favor preencha todos os campos!')
    return
  }
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    const banned = await checkIfBanned(result.user.email)
    if (banned) {
      await signOut(auth)
      setError('Esta conta foi banida. Entre em contato pelo Fale Conosco se achar que foi um engano.')
      return
    }
    navigate('/dashboard')
  } catch (err) {
    setError('Email ou senha incorretos.')
    console.error(err)
  }
}

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #009c3b 0%, #0d2b1a 50%, #169b62 100%)' }}
    >
      <AnimatedSection direction="up" className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">

          <div className="text-center mb-8">
            <h1 className="text-4xl font-black" style={{ background: 'linear-gradient(135deg, #009c3b, #0d2b1a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ELOS
            </h1>
            <div className="flex justify-center gap-2 mt-2 mb-4">
              <div className="h-1 w-8 rounded-full bg-yellow-400"></div>
              <div className="h-1 w-8 rounded-full bg-green-600"></div>
              <div className="h-1 w-8 rounded-full" style={{ backgroundColor: '#169b62' }}></div>
            </div>
            <p className="text-gray-500">{t('loginTitle')}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('emailLabel')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('passwordLabel')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm"
              />
            </div>

            <button
              onClick={handleEmailLogin}
              className="w-full text-white py-3 rounded-xl font-bold hover:opacity-90 transition mt-2 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #009c3b, #0d2b1a)' }}
            >
              {t('loginButton')}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 text-sm">ou</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 transition font-semibold text-gray-700 shadow-sm"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              {t('loginWithGoogle')}
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            {t('noAccount')}{' '}
            <Link to="/register" className="text-green-600 font-bold hover:underline">
              {t('registerHere')}
            </Link>
          </p>

        </div>
      </AnimatedSection>
    </div>
  )
}

export default LoginPage