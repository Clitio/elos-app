import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import PhotoUpload from '../components/PhotoUpload'
import LanguageSelector from '../components/LanguageSelector'
import { useLanguage } from '../context/LanguageContext'
import PageHeader from '../components/PageHeader'
import AnimatedSection from '../components/AnimatedSection'
import LoadingSpinner from '../components/LoadingSpinner'

const days = ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo']
const timeSlots = ['fechado', '08:00-17:00', '09:00-18:00', '10:00-19:00', '10:00-22:00', '12:00-22:00', '00:00-00:00']

const EditProfilePage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [accountType, setAccountType] = useState('user')
  const [userName, setUserName] = useState('')
  const [userPhoto, setUserPhoto] = useState('')
  const [area, setArea] = useState('')
  const [location, setLocation] = useState('')
  const [languages, setLanguages] = useState([])
  const [description, setDescription] = useState('')
  const [yearsInIreland, setYearsInIreland] = useState('')
  const [category, setCategory] = useState('health')
  const [photo, setPhoto] = useState(null)
  const [establishmentName, setEstablishmentName] = useState('')
  const [establishmentType, setEstablishmentType] = useState('')
  const [address, setAddress] = useState('')
  const [openingHours, setOpeningHours] = useState({})

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') handleSave()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [area, location, languages, description, yearsInIreland, category, establishmentName, establishmentType, address, openingHours, userName, userPhoto])

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser
      if (!user) return

      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        setAccountType(userDoc.data().accountType)
        setUserName(userDoc.data().name || '')
        setUserPhoto(userDoc.data().photo || '')
      }

      const professionalDoc = await getDoc(doc(db, 'professionals', user.uid))
      if (professionalDoc.exists()) {
        const data = professionalDoc.data()
        setArea(data.area || '')
        setLocation(data.location || '')
        setLanguages(Array.isArray(data.languages) ? data.languages : [])
        setDescription(data.description || '')
        setYearsInIreland(data.yearsInIreland || '')
        setCategory(data.category || 'health')
        setPhoto(data.photo || null)
      }

      const establishmentDoc = await getDoc(doc(db, 'establishments', user.uid))
      if (establishmentDoc.exists()) {
        const data = establishmentDoc.data()
        setEstablishmentName(data.name || '')
        setEstablishmentType(data.type || '')
        setAddress(data.address || '')
        setLanguages(Array.isArray(data.languages) ? data.languages : [])
        setDescription(data.description || '')
        setCategory(data.category || 'health')
        setPhoto(data.photo || null)
        try {
          setOpeningHours(JSON.parse(data.openingHours) || {})
        } catch {
          setOpeningHours({})
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const handleHoursChange = (day, value) => {
    setOpeningHours((prev) => ({ ...prev, [day]: value }))
  }

  const handleSave = async () => {
    const user = auth.currentUser

    if (accountType === 'user') {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          name: userName,
          photo: userPhoto,
        }, { merge: true })
        setSuccess(true)
        setTimeout(() => navigate('/dashboard'), 2000)
      } catch (err) {
        setError('Erro ao guardar perfil. Tenta novamente.')
        console.error(err)
      }
    }

    if (accountType === 'professional') {
      if (!area || !location || languages.length === 0 || !description) {
        setError('Por favor preenche todos os campos!')
        return
      }
      try {
        await setDoc(doc(db, 'professionals', user.uid), {
          name: user.displayName,
          email: user.email,
          photo: photo || user.photoURL || null,
          area, location, languages, category, description,
          yearsInIreland: parseInt(yearsInIreland) || 0,
        }, { merge: true })
        setSuccess(true)
        setTimeout(() => navigate('/dashboard'), 2000)
      } catch (err) {
        setError('Erro ao guardar perfil. Tenta novamente.')
        console.error(err)
      }
    }

    if (accountType === 'establishment') {
      if (!establishmentName || !establishmentType || !address || !description) {
        setError('Por favor preenche todos os campos!')
        return
      }
      try {
        await setDoc(doc(db, 'establishments', user.uid), {
          name: establishmentName,
          email: user.email,
          photo: photo || null,
          type: establishmentType,
          address,
          openingHours: JSON.stringify(openingHours),
          languages, category, description,
        }, { merge: true })
        setSuccess(true)
        setTimeout(() => navigate('/dashboard'), 2000)
      } catch (err) {
        setError('Erro ao guardar estabelecimento. Tenta novamente.')
        console.error(err)
      }
    }
  }

  if (loading) return <LoadingSpinner />

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(135deg, #009c3b 0%, #0d2b1a 50%, #169b62 100%)' }}
      >
        <AnimatedSection direction="up" className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
            <div className="text-7xl mb-6">✅</div>
            <h1 className="text-3xl font-black mb-2" style={{
              background: 'linear-gradient(135deg, #009c3b, #0d2b1a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {t('profileUpdated')}
            </h1>
            <div className="flex justify-center gap-2 my-4">
              <div className="h-1 w-8 rounded-full bg-yellow-400"></div>
              <div className="h-1 w-8 rounded-full bg-green-600"></div>
              <div className="h-1 w-8 rounded-full" style={{ backgroundColor: '#169b62' }}></div>
            </div>
            <p className="text-gray-500">{t('redirecting')}</p>
          </div>
        </AnimatedSection>
      </div>
    )
  }

  const categoryOptions = [
    { value: 'health', label: t('health') },
    { value: 'food', label: t('food') },
    { value: 'transport', label: t('transport') },
    { value: 'beauty', label: t('beauty') },
    { value: 'community', label: t('community') },
    { value: 'accommodation', label: t('accommodation') },
    { value: 'daily', label: t('dailyBasis') },
  ]

  return (
    <div>
      <PageHeader
        title={t('editProfileTitle')}
        subtitle={t('updateInfo')}
        gradient="dark"
      />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <AnimatedSection direction="up">
          <div className="bg-white rounded-3xl shadow-md p-8">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6 text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-5">

              {accountType === 'user' && (
                <>
                  <div className="flex justify-center mb-2">
                    <PhotoUpload currentPhoto={userPhoto} onUploadComplete={(url) => setUserPhoto(url)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('fullName')}</label>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm" />
                  </div>
                </>
              )}

              {accountType === 'professional' && (
                <>
                  <div className="flex justify-center mb-2">
                    <PhotoUpload currentPhoto={photo} onUploadComplete={(url) => setPhoto(url)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('workArea')}</label>
                    <input type="text" value={area} onChange={(e) => setArea(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('locationInCork')}</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('languagesYouSpeak')}</label>
                    <LanguageSelector selected={languages} onChange={setLanguages} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('yearsInIreland')}</label>
                    <input type="number" value={yearsInIreland} onChange={(e) => setYearsInIreland(e.target.value)} min={0} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('category')}</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm">
                      {categoryOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('description')}</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm" />
                  </div>
                </>
              )}

              {accountType === 'establishment' && (
                <>
                  <div className="flex justify-center mb-2">
                    <PhotoUpload currentPhoto={photo} onUploadComplete={(url) => setPhoto(url)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('establishmentName')}</label>
                    <input type="text" value={establishmentName} onChange={(e) => setEstablishmentName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('businessType')}</label>
                    <input type="text" value={establishmentType} onChange={(e) => setEstablishmentType(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('address')}</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('openingHours')}</label>
                    <div className="flex flex-col gap-2">
                      {days.map((day) => (
                        <div key={day} className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 w-20">{day}</span>
                          <select
                            value={openingHours[day] || 'fechado'}
                            onChange={(e) => handleHoursChange(day, e.target.value)}
                            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400 shadow-sm"
                          >
                            {timeSlots.map((slot) => (
                              <option key={slot} value={slot}>{slot === 'fechado' ? 'Fechado' : slot === '00:00-00:00' ? '24 horas' : slot}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('languagesSpoken')}</label>
                    <LanguageSelector selected={languages} onChange={setLanguages} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('category')}</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm">
                      {categoryOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('description')}</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm" />
                  </div>
                </>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 text-white py-4 rounded-2xl font-bold hover:opacity-90 transition shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #009c3b, #0d2b1a)' }}
                >
                  {t('saveChanges')}
                </button>
                <Link
                  to="/dashboard"
                  className="flex-1 text-center border-2 border-gray-300 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-50 transition"
                >
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

export default EditProfilePage