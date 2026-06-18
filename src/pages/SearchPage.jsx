import React, { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import ProfessionalCard from '../components/ProfessionalCard'
import PageHeader from '../components/PageHeader'
import AnimatedSection from '../components/AnimatedSection'
import LoadingSpinner from '../components/LoadingSpinner'
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
          id: doc.id, profileType: 'professional', ...doc.data()
        }))

        const estSnapshot = await getDocs(collection(db, 'establishments'))
        const estData = estSnapshot.docs.map((doc) => ({
          id: doc.id, profileType: 'establishment', ...doc.data()
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

  if (loading) return <LoadingSpinner />

  const allItems = [...professionals, ...establishments]
  const tabFiltered = activeTab === 'all' ? allItems : activeTab === 'professionals' ? professionals : establishments
  const filtered = tabFiltered.filter((p) => {
    const matchesQuery =
      p.name?.toLowerCase().includes(query.toLowerCase()) ||
      p.area?.toLowerCase().includes(query.toLowerCase()) ||
      p.businessType?.toLowerCase().includes(query.toLowerCase()) ||
      p.location?.toLowerCase().includes(query.toLowerCase()) ||
      p.address?.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'all' || p.category === category
    return matchesQuery && matchesCategory
  })

  return (
    <div>
      <PageHeader
        title={t('searchTitle')}
        subtitle={t('searchSubtitle')}
        gradient="blue"
      />

      <div className="max-w-5xl mx-auto px-6 py-12">

        <AnimatedSection direction="up">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm"
            >
              {categories(t).map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 mb-8 flex-wrap">
            {[
              { key: 'all', label: `${t('all')} (${allItems.length})` },
              { key: 'professionals', label: `${t('professionals')} (${professionals.length})` },
              { key: 'establishments', label: `${t('establishments')} (${establishments.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition ${
                  activeTab === tab.key
                    ? 'text-white shadow-lg'
                    : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
                style={activeTab === tab.key ? { background: 'linear-gradient(135deg, #009c3b, #0d2b1a)' } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {filtered.length === 0 ? (
          <AnimatedSection direction="up">
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">{t('noResults')}</p>
            </div>
          </AnimatedSection>
        ) : (
          <>
            <AnimatedSection direction="up">
              <p className="text-gray-500 text-sm mb-6">{filtered.length} resultado(s)</p>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, index) => (
                <AnimatedSection key={item.id} direction="up" delay={index * 0.05}>
                  <ProfessionalCard {...item} />
                </AnimatedSection>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default SearchPage