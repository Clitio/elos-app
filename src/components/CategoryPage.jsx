import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import ProfessionalCard from './ProfessionalCard'
import PageHeader from './PageHeader'
import AnimatedSection from './AnimatedSection'
import LoadingSpinner from './LoadingSpinner'
import { useLanguage } from '../context/LanguageContext'

const CategoryPage = ({ category, title, description, gradient = 'green' }) => {
  const { t } = useLanguage()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profQuery = query(collection(db, 'professionals'), where('category', '==', category))
        const profSnapshot = await getDocs(profQuery)
        const profData = profSnapshot.docs.map((doc) => ({
          id: doc.id, profileType: 'professional', ...doc.data()
        }))

        const estQuery = query(collection(db, 'establishments'), where('category', '==', category))
        const estSnapshot = await getDocs(estQuery)
        const estData = estSnapshot.docs.map((doc) => ({
          id: doc.id, profileType: 'establishment', ...doc.data()
        }))

        setItems([...profData, ...estData])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [category])

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <PageHeader title={title} subtitle={description} gradient={gradient} />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {items.length === 0 ? (
          <AnimatedSection direction="up">
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">{t('noResults')}</p>
              <p className="text-gray-400 text-sm mt-2">Se o primeiro a cadastrar-te!</p>
            </div>
          </AnimatedSection>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
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

export default CategoryPage