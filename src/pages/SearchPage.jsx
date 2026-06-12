import React, { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import ProfessionalCard from '../components/ProfessionalCard'
import { useLanguage } from '../context/LanguageContext'

const categories = (t) => [
  { value: 'all', label: t('allCategories') },
  { value: 'health', label: t('health') },
  { value: 'food', label: t('food') },
  { value: 'transport', label: t('transport') },
  { value: 'beauty', label: t('beauty') },
  { value: 'community', label: t('community') },
  { value: 'accommodation', label: t('accommodation') },
  { value: 'daily', label: t('dailyBasis') },
]

const SearchPage = () => {
  const { t } = useLanguage()
  const [professionals, setProfessionals] = useState([])
  const [establishments, setEstablishments] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
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
  const tabFiltered = activeTab === 'all' ? allItems : activeTab === 'professionals' ? professionals : establishments

  const filtered = tabFiltered.filter((p) => {
    const matchesQuery =
      p.name?.toLowerCase().includes(query.toLowerCase()) ||
      p.area?.toLowerCase().includes(query.toLowerCase()) ||
      p.type?.toLowerCase().includes(query.toLowerCase()) ||
      p.location?.toLowerCase().includes(query.toLowerCase()) ||
      p.address?.toLowerCase().includes(query.toLowerCase())

    const matchesCategory = category === 'all' || p.category === category

    return matchesQuery && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-lg">A carregar...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('searchTitle')}</h1>
        <p className="text-gray-500">{t('searchSubtitle')}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-400"
        >
          {categories(t).map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-2 rounded-full font-semibold text-sm transition ${activeTab === 'all' ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
        >
          {t('all')} ({allItems.length})
        </button>
        <button
          onClick={() => setActiveTab('professionals')}
          className={`px-6 py-2 rounded-full font-semibold text-sm transition ${activeTab === 'professionals' ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
        >
          {t('professionals')} ({professionals.length})
        </button>
        <button
          onClick={() => setActiveTab('establishments')}
          className={`px-6 py-2 rounded-full font-semibold text-sm transition ${activeTab === 'establishments' ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
        >
          {t('establishments')} ({establishments.length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">{t('noResults')}</p>
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-6">{filtered.length} {t('professionals').toLowerCase()}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProfessionalCard key={p.id} {...p} />
            ))}
          </div>
        </>
      )}

    </div>
  )
}

export default SearchPage