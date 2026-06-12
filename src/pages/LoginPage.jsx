import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEmailLogin()
    }
  }
  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [email, password])

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/dashboard')
    } catch (err) {
      setError('Erro ao fazer login com Google. Tenta novamente.')
      console.error(err)
    }
  }

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError('Por favor preenche todos os campos!')
      return
    }
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Email ou password incorretos.')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">Elos</h1>
          <p className="text-gray-500 mt-2">Entra na tua conta</p>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <div className="flex flex-col gap-4">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="o-teu-email@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="A tua password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400"
            />
          </div>

          <button
            onClick={handleEmailLogin}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Entrar
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm">ou</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition font-semibold text-gray-700"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Entrar com Google
          </button>

        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Ainda nao tens conta?{' '}
          <Link to="/register" className="text-green-600 font-semibold hover:underline">
            Cadastra-te
          </Link>
        </p>

      </div>
    </div>
  )
}

export default LoginPage