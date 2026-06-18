import React from 'react'
import CategoryPage from '../components/CategoryPage'
import { useLanguage } from '../context/LanguageContext'

const TransportPage = () => {
  const { t } = useLanguage()
  return <CategoryPage category="transport" title={t('transport')} description={t('transportDesc')} gradient="blue" />
}

export default TransportPage