import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import PhotoUpload from '../components/PhotoUpload'
import { useLanguage } from '../context/LanguageContext'
import PageHeader from '../components/PageHeader'
import AnimatedSection from '../components/AnimatedSection'
import LoadingSpinner from '../components/LoadingSpinner'

const EditUserProfilePage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [userName, setUserName] = useState('')
  const [userPhoto, setUserPhoto] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser
      if (!user) return
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        setUserName(userDoc.data().name || '')
        setUserPhoto(userDoc.data().photo || '')
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    const user = auth.currentUser
    try {
      await setDoc(doc(db, 'users', user.uid), {
        name: userName,
        photo: userPhoto,
      }, { merge: true })
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <LoadingSpinner />

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(135deg, #009c3b 0%, #0d2b1a 50%, #169b62 100%)' }}
      >
        <AnimatedSection direction="up" className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
            <div className="text-7xl mb-6">✅</div>
            <h1 className="text-3xl font-black mb-2" style={{
              background: 'linear-gradient(135deg, #009c3b, #0d2b1a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>{t('profileUpdated')}</h1>
            <p className="text-gray-500">{t('redirecting')}</p>
          </div>
        </AnimatedSection>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title={t('editProfileTitle')} subtitle={t('updateInfo')} gradient="dark" />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <AnimatedSection direction="up">
          <div className="bg-white rounded-3xl shadow-md p-8">
            <div className="flex flex-col gap-5">
              <div className="flex justify-center mb-2">
                <PhotoUpload currentPhoto={userPhoto} onUploadComplete={(url) => setUserPhoto(url)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('fullName')}</label>
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm" />
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={handleSave} className="flex-1 text-white py-4 rounded-2xl font-bold hover:opacity-90 transition shadow-lg" style={{ background: 'linear-gradient(135deg, #009c3b, #0d2b1a)' }}>
                  {t('saveChanges')}
                </button>
                <Link to="/dashboard" className="flex-1 text-center border-2 border-gray-300 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-50 transition">
                  {t('cancel')}
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

export default EditUserProfilePage