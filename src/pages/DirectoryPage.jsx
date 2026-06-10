import React, { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import ProfessionalCard from '../components/ProfessionalCard'

const DirectoryPage = () => {
  const [professionals, setProfessionals] = useState([])
  const [establishments, setEstablishments] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profSnapshot = await getDocs(collection(db, 'professionals'))
        const profData = profSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: 'professional',
          ...doc.data()
        }))

        const estSnapshot = await getDocs(collection(db, 'establishments'))
        const estData = estSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: 'establishment',
          ...doc.data()
        }))

        setProfessionals(profData)
        setEstablishments(estData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const allItems = [...professionals, ...establishments]
  const displayed = activeTab === 'all' ? allItems : activeTab === 'professionals' ? professionals : establishments

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-lg">A carregar...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Diretorio</h1>
        <p className="text-gray-500">Encontra brasileiros e negocios em Cork</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 justify-center">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-2 rounded-full font-semibold text-sm transition ${activeTab === 'all' ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
        >
          Todos ({allItems.length})
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

      {displayed.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">Nenhum resultado encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((item) => (
            <ProfessionalCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default DirectoryPage