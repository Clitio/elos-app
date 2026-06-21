import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useLanguage } from '../context/LanguageContext'
import PhotoUpload from '../components/PhotoUpload'
import LanguageSelector from '../components/LanguageSelector'
import PageHeader from '../components/PageHeader'
import AnimatedSection from '../components/AnimatedSection'
import LoadingSpinner from '../components/LoadingSpinner'

const days = ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo']
const timeSlots = ['fechado', '08:00-17:00', '09:00-18:00', '10:00-19:00', '10:00-22:00', '12:00-22:00', '00:00-00:00']

const AddProfilePage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [profileType, setProfileType] = useState('professional')
  const [totalProfiles, setTotalProfiles] = useState(0)
  const [error, setError] = useState('')
  const [area, setArea] = useState('')
  const [location, setLocation] = useState('')
  const [languages, setLanguages] = useState([])
  const [category, setCategory] = useState('health')
  const [description, setDescription] = useState('')
  const [yearsInIreland, setYearsInIreland] = useState('')
  const [photo, setPhoto] = useState(null)
  const [whatsapp, setWhatsapp] = useState('')
  const [establishmentName, setEstablishmentName] = useState('')
  const [establishmentType, setEstablishmentType] = useState('')
  const [address, setAddress] = useState('')
  const [openingHours, setOpeningHours] = useState({})

  useEffect(() => {
    const fetchTotalProfiles = async () => {
      const user = auth.currentUser
      if (!user) { navigate('/login'); return }

      const profQuery = query(collection(db, 'professionals'), where('ownerId', '==', user.uid))
      const profSnapshot = await getDocs(profQuery)

      const estQuery = query(collection(db, 'establishments'), where('ownerId', '==', user.uid))
      const estSnapshot = await getDocs(estQuery)

      const total = profSnapshot.size + estSnapshot.size
      setTotalProfiles(total)

      if (total >= 5) {
        navigate('/dashboard')
        return
      }

      setLoading(false)
    }

    fetchTotalProfiles()
  }, [navigate])

  const handleHoursChange = (day, value) => {
    setOpeningHours((prev) => ({ ...prev, [day]: value }))
  }

  const handleSave = async () => {
    const user = auth.currentUser

    if (profileType === 'professional') {
      if (!area || !location || languages.length === 0 || !description) {
        setError('Por favor preenche todos os campos!')
        return
      }
      try {
        await addDoc(collection(db, 'professionals'), {
          ownerId: user.uid,
          name: user.displayName,
          email: user.email,
          photo: photo || user.photoURL || null,
          whatsapp: whatsapp || null,
          area, location, languages, category, description,
          yearsInIreland: parseInt(yearsInIreland) || 0,
          createdAt: new Date(),
        })
        navigate('/dashboard')
      } catch (err) {
        setError('Erro ao guardar perfil. Tenta novamente.')
        console.error(err)
      }
    }

    if (profileType === 'establishment') {
      if (!establishmentName || !establishmentType || !address || !description) {
        setError('Por favor preenche todos os campos!')
        return
      }
      try {
        await addDoc(collection(db, 'establishments'), {
          ownerId: user.uid,
          name: establishmentName,
          email: user.email,
          photo: photo || null,
          businessType: establishmentType,
          address,
          whatsapp: whatsapp || null,
          openingHours: JSON.stringify(openingHours),
          languages, category, description,
          createdAt: new Date(),
        })
        navigate('/dashboard')
      } catch (err) {
        setError('Erro ao guardar estabelecimento. Tenta novamente.')
        console.error(err)
      }
    }
  }

  if (loading) return <LoadingSpinner />

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm"

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
        title={t('addNewProfile')}
        subtitle={`${totalProfiles}/5 ${t('addProfileSubtitle')}`}
        gradient="green"
      />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <AnimatedSection direction="up">
          <div className="bg-white rounded-3xl shadow-md p-8">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6 text-center">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">{t('selectProfileType')}</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setProfileType('professional')}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition ${
                    profileType === 'professional' ? 'text-white shadow-lg' : 'border-2 border-gray-200 text-gray-600'
                  }`}
                  style={profileType === 'professional' ? { background: 'linear-gradient(135deg, #009c3b, #0d2b1a)' } : {}}
                >
                  {t('professionals')}
                </button>
                <button
                  onClick={() => setProfileType('establishment')}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition ${
                    profileType === 'establishment' ? 'text-white shadow-lg' : 'border-2 border-gray-200 text-gray-600'
                  }`}
                  style={profileType === 'establishment' ? { background: 'linear-gradient(135deg, #1a3a6b, #0d2b1a)' } : {}}
                >
                  {t('establishments')}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-center mb-2">
                <PhotoUpload currentPhoto={null} onUploadComplete={(url) => setPhoto(url)} />
              </div>

              {profileType === 'professional' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('workArea')}</label>
                    <input type="text" value={area} onChange={(e) => setArea(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))} placeholder="Ex: Advogado, Medico" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('locationInCork')}</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ex: Cork City Centre" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('languagesYouSpeak')}</label>
                    <LanguageSelector selected={languages} onChange={setLanguages} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('whatsappNumber')}</label>
                    <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder={t('whatsappPlaceholder')} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('yearsInIreland')}</label>
                    <input type="number" value={yearsInIreland} onChange={(e) => setYearsInIreland(e.target.value)} placeholder="Ex: 2" min={0} className={inputClass} />
                  </div>
                </>
              )}

              {profileType === 'establishment' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('establishmentName')}</label>
                    <input type="text" value={establishmentName} onChange={(e) => setEstablishmentName(e.target.value)} placeholder="Ex: Restaurante Sabor Brasil" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('businessType')}</label>
                    <input type="text" value={establishmentType} onChange={(e) => setEstablishmentType(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))} placeholder="Ex: Restaurante, Loja" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('address')}</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ex: 123 Patrick Street" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('whatsappNumber')}</label>
                    <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder={t('whatsappPlaceholder')} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('openingHours')}</label>
                    <div className="flex flex-col gap-2">
                      {days.map((day) => (
                        <div key={day} className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 w-20">{day}</span>
                          <select onChange={(e) => handleHoursChange(day, e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400">
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
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('category')}</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                  {categoryOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('description')}</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="..." rows={4} className={inputClass} />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 text-white py-4 rounded-2xl font-bold hover:opacity-90 transition shadow-lg"
                  style={{ background: profileType === 'establishment' ? 'linear-gradient(135deg, #1a3a6b, #0d2b1a)' : 'linear-gradient(135deg, #009c3b, #0d2b1a)' }}
                >
                  {t('saveProfile')}
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 border-2 border-gray-300 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-50 transition"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

export default AddProfilePage