import React from 'react'
import CategoryPage from '../components/CategoryPage'
import { useLanguage } from '../context/LanguageContext'

const HealthPage = () => {
  const { t } = useLanguage()
  return <CategoryPage category="health" title={t('health')} description={t('healthDesc')} gradient="green" />
}

export default HealthPage