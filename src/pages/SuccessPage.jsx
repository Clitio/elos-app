import React from 'react'
import { Link } from 'react-router-dom'

const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 w-full max-w-md text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">Bem-vindo ao Elos!</h1>
        <p className="text-gray-500 mb-8">
          A tua conta foi criada com sucesso. Ja podes explorar profissionais brasileiros em Cork.
        </p>
        <div className="flex flex-col gap-4">
          <Link
            to="/directory"
            className="block bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Ver Profissionais
          </Link>
          <Link
            to="/dashboard"
            className="block border border-green-600 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            O Meu Perfil
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage