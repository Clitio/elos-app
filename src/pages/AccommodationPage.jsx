import React from 'react'
import CategoryPage from '../components/CategoryPage'
import { useLanguage } from '../context/LanguageContext'

const AccommodationPage = () => {
  const { t } = useLanguage()
  return <CategoryPage category="accommodation" title={t('accommodation')} description="Quartos e casas em Cork" />
}

export default AccommodationPage