import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase'
import defaultAvatar from '../assets/defaultAvatar'

const AdminPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [professionals, setProfessionals] = useState([])
  const [establishments, setEstablishments] = useState([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/login')
        return
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        if (!userDoc.exists() || !userDoc.data().isAdmin) {
          navigate('/')
          return
        }

        const usersSnapshot = await getDocs(collection(db, 'users'))
        setUsers(usersSnapshot.docs.map((d) => ({ id: d.id, ...d.data() })))

        const profSnapshot = await getDocs(collection(db, 'professionals'))
        setProfessionals(profSnapshot.docs.map((d) => ({ id: d.id, ...d.data() })))

        const estSnapshot = await getDocs(collection(db, 'establishments'))
        setEstablishments(estSnapshot.docs.map((d) => ({ id: d.id, ...d.data() })))

        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [navigate])

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Tens a certeza que queres apagar este utilizador?')) return
    try {
      await deleteDoc(doc(db, 'users', id))
      setUsers(users.filter((u) => u.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteProfessional = async (id) => {
    if (!window.confirm('Tens a certeza que queres apagar este profissional?')) return
    try {
      await deleteDoc(doc(db, 'professionals', id))
      setProfessionals(professionals.filter((p) => p.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteEstablishment = async (id) => {
    if (!window.confirm('Tens a certeza que queres apagar este estabelecimento?')) return
    try {
      await deleteDoc(doc(db, 'establishments', id))
      setEstablishments(establishments.filter((e) => e.id !== id))
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
    <div className="max-w-6xl mx-auto px-6 py-12">

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
        <p className="text-gray-500 mt-1">Gere todos os utilizadores e perfis do Elos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <p className="text-4xl font-bold text-green-600">{users.length}</p>
          <p className="text-gray-500 mt-1">Utilizadores</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <p className="text-4xl font-bold text-green-600">{professionals.length}</p>
          <p className="text-gray-500 mt-1">Profissionais</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <p className="text-4xl font-bold text-green-600">{establishments.length}</p>
          <p className="text-gray-500 mt-1">Estabelecimentos</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2 rounded-full font-semibold text-sm transition ${activeTab === 'users' ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
        >
          Utilizadores ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('professionals')}
          className={`px-6 py-2 rounded-full font-semibold text-sm transition ${activeTab === 'professionals' ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
        >
          Profissionais ({professionals.length})
        </button>
        <button
          onClick={() => setActiveTab('establishments')}
          className={`px-6 py-2 rounded-full font-semibold text-sm transition ${activeTab === 'establishments' ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
        >
          Estabelecimentos ({establishments.length})
        </button>
      </div>

      {/* Utilizadores */}
      {activeTab === 'users' && (
        <div className="flex flex-col gap-4">
          {users.length === 0 && <p className="text-gray-400 text-center py-10">Nenhum utilizador encontrado.</p>}
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={user.photo || defaultAvatar} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-green-400" />
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${
                    user.accountType === 'professional' ? 'bg-green-100 text-green-700' :
                    user.accountType === 'establishment' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {user.accountType === 'professional' ? 'Profissional' : user.accountType === 'establishment' ? 'Estabelecimento' : 'Utilizador'}
                  </span>
                  {user.isAdmin && (
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full mt-1 ml-1 bg-yellow-100 text-yellow-700">Admin</span>
                  )}
                </div>
              </div>
              {!user.isAdmin && (
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition"
                >
                  Apagar
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Profissionais */}
      {activeTab === 'professionals' && (
        <div className="flex flex-col gap-4">
          {professionals.length === 0 && <p className="text-gray-400 text-center py-10">Nenhum profissional encontrado.</p>}
          {professionals.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={p.photo || defaultAvatar} alt={p.name} className="w-12 h-12 rounded-full object-cover border-2 border-green-400" />
                <div>
                  <p className="font-semibold text-gray-800">{p.name}</p>
                  <p className="text-green-600 text-sm">{p.area}</p>
                  <p className="text-gray-400 text-sm">{p.email}</p>
                  <p className="text-gray-400 text-sm">{p.location}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteProfessional(p.id)}
                className="bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition"
              >
                Apagar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Estabelecimentos */}
      {activeTab === 'establishments' && (
        <div className="flex flex-col gap-4">
          {establishments.length === 0 && <p className="text-gray-400 text-center py-10">Nenhum estabelecimento encontrado.</p>}
          {establishments.map((e) => (
            <div key={e.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={e.photo || defaultAvatar} alt={e.name} className="w-12 h-12 rounded-full object-cover border-2 border-blue-400" />
                <div>
                  <p className="font-semibold text-gray-800">{e.name}</p>
                  <p className="text-blue-600 text-sm">{e.type}</p>
                  <p className="text-gray-400 text-sm">{e.email}</p>
                  <p className="text-gray-400 text-sm">{e.address}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteEstablishment(e.id)}
                className="bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition"
              >
                Apagar
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default AdminPage