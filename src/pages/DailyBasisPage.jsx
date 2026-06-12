import React from 'react'
import CategoryPage from '../components/CategoryPage'
import { useLanguage } from '../context/LanguageContext'

const DailyBasisPage = () => {
  const { t } = useLanguage()
  return <CategoryPage category="daily" title={t('dailyBasis')} description="Servicos do quotidiano em portugues" />
}

export default DailyBasisPage