import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import ProfessionalCard from './ProfessionalCard'

const CategoryPage = ({ category, title, description }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profQuery = query(collection(db, 'professionals'), where('category', '==', category))
        const profSnapshot = await getDocs(profQuery)
        const profData = profSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: 'professional',
          ...doc.data()
        }))

        const estQuery = query(collection(db, 'establishments'), where('category', '==', category))
        const estSnapshot = await getDocs(estQuery)
        const estData = estSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: 'establishment',
          ...doc.data()
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-lg">A carregar...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-500">{description}</p>
      </div>
      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">Nenhum resultado nesta categoria ainda.</p>
          <p className="text-gray-400 text-sm mt-2">Se o primeiro a cadastrar-te!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ProfessionalCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryPage