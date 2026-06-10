import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const DashboardPage = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [professionalData, setProfessionalData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser

      if (!user) {
        navigate('/login')
        return
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        setUserData(userDoc.data())
      }

      const professionalDoc = await getDoc(doc(db, 'professionals', user.uid))
      if (professionalDoc.exists()) {
        setProfessionalData(professionalDoc.data())
      }

      setLoading(false)
    }

    fetchData()
  }, [navigate])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-lg">A carregar...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">O Meu Perfil</h1>
        <p className="text-gray-500 mt-2">Gere as tuas informacoes</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">
        <div className="flex items-center gap-6 mb-6">
          <img
            src={userData?.photo || 'https://via.placeholder.com/80'}
            alt={userData?.name}
            className="w-24 h-24 rounded-full border-2 border-green-400"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{userData?.name}</h2>
            <p className="text-green-600 font-semibold">{professionalData?.area || 'Utilizador'}</p>
            <p className="text-gray-400 text-sm">{professionalData?.location || ''}</p>
            <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full mt-1">
              {userData?.accountType === 'professional' ? 'Profissional' : 'Utilizador'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-500">Email</p>
            <p className="text-gray-700">{userData?.email}</p>
          </div>

          {professionalData && (
            <>
              <div>
                <p className="text-sm font-semibold text-gray-500">Anos na Irlanda</p>
                <p className="text-gray-700">{professionalData.yearsInIreland} ano(s)</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Idiomas</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {professionalData.languages.map((lang) => (
                    <span key={lang} className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Descricao</p>
                <p className="text-gray-700">{professionalData.description}</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Link
          to="/edit-profile"
          className="block text-center bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Editar Perfil
        </Link>
        <Link
          to="/directory"
          className="block text-center border border-green-600 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
        >
          Ver Diretorio
        </Link>
        <button
          onClick={handleLogout}
          className="w-full border border-red-400 text-red-400 py-3 rounded-lg font-semibold hover:bg-red-50 transition"
        >
          Terminar Sessao
        </button>
      </div>

    </div>
  )
}

export default DashboardPage