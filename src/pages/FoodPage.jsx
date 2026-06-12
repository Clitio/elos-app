import React from 'react'
import CategoryPage from '../components/CategoryPage'
import { useLanguage } from '../context/LanguageContext'

const FoodPage = () => {
  const { t } = useLanguage()
  return <CategoryPage category="food" title={t('food')} description="Restaurantes, mercearias e produtos brasileiros" />
}

export default FoodPage