import React, { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import ProfessionalCard from '../components/ProfessionalCard'
import PageHeader from '../components/PageHeader'
import AnimatedSection from '../components/AnimatedSection'
import LoadingSpinner from '../components/LoadingSpinner'
import { useLanguage } from '../context/LanguageContext'

const DirectoryPage = () => {
  const { t } = useLanguage()
  const [professionals, setProfessionals] = useState([])
  const [establishments, setEstablishments] = useState([])
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
  const displayed = activeTab === 'all' ? allItems : activeTab === 'professionals' ? professionals : establishments

  return (
    <div>
      <PageHeader
        title={t('directoryTitle')}
        subtitle={t('directorySubtitle')}
        gradient="green"
      />

      <div className="max-w-5xl mx-auto px-6 py-12">

        <AnimatedSection direction="up">
          <div className="flex gap-2 mb-10 justify-center flex-wrap">
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

        {displayed.length === 0 ? (
          <AnimatedSection direction="up">
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">{t('noResults')}</p>
            </div>
          </AnimatedSection>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((item, index) => (
              <AnimatedSection key={item.id} direction="up" delay={index * 0.05}>
                <ProfessionalCard {...item} />
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DirectoryPage