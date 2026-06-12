import React from 'react'
import CategoryPage from '../components/CategoryPage'
import { useLanguage } from '../context/LanguageContext'

const CommunityPage = () => {
  const { t } = useLanguage()
  return <CategoryPage category="community" title={t('community')} description="Igrejas, grupos e eventos brasileiros" />
}

export default CommunityPage