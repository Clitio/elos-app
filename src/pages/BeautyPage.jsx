import React from 'react'
import CategoryPage from '../components/CategoryPage'
import { useLanguage } from '../context/LanguageContext'

const BeautyPage = () => {
  const { t } = useLanguage()
  return <CategoryPage category="beauty" title={t('beauty')} description="Cabeleireiros, manicure e estetica" />
}

export default BeautyPage