import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, addDoc, collection } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase'
import PhotoUpload from '../components/PhotoUpload'
import LanguageSelector from '../components/LanguageSelector'
import { containsBadWord } from '../utils/badWords'
import { useLanguage } from '../context/LanguageContext'
import AnimatedSection from '../components/AnimatedSection'

const days = ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo']
const timeSlots = ['fechado', '08:00-17:00', '09:00-18:00', '10:00-19:00', '10:00-22:00', '12:00-22:00', '00:00-00:00']

const RegisterPage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [step, setStep] = useState(1)
  const [accountType, setAccountType] = useState('user')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
  const [error, setError] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (step === 1) handleEmailRegister()
        else if (step === 2) handleCompleteProfile()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [step, name, email, password, confirmPassword, area, location, languages, description, yearsInIreland, establishmentName, establishmentType, address, openingHours, whatsapp])

  const formatName = (value) => {
    const exceptions = ['da', 'de', 'do', 'das', 'dos', 'des', 'e']
    return value.toLowerCase().split(' ').map((word, index) =>
      exceptions.includes(word) && index !== 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validatePassword = (password) => {
    return /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && password.length >= 10
  }

  const handleHoursChange = (day, value) => {
    setOpeningHours((prev) => ({ ...prev, [day]: value }))
  }

  const saveUserToFirestore = async (user, type) => {
    await setDoc(doc(db, 'users', user.uid), {
      name: user.displayName || name,
      email: user.email,
      photo: user.photoURL || null,
      accountType: type,
      createdAt: new Date(),
    })
  }

  const handleEmailRegister = async () => {
    if (!name || !email || !password || !confirmPassword) { setError('Por favor preenche todos os campos!'); return }
    if (containsBadWord(name)) { setError('O nome contem palavras inadequadas.'); return }
    if (!validateEmail(email)) { setError('Por favor insere um email valido.'); return }
    if (!validatePassword(password)) { setError('A password deve ter no minimo 10 caracteres, letra maiuscula, minuscula e numero.'); return }
    if (password !== confirmPassword) { setError('As passwords nao coincidem!'); return }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName: formatName(name) })
      await saveUserToFirestore(result.user, accountType)
      setError('')
      if (accountType === 'professional' || accountType === 'establishment') setStep(2)
      else navigate('/success')
    } catch (err) {
      setError('Erro ao criar conta. Este email ja pode estar em uso.')
      console.error(err)
    }
  }

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      await saveUserToFirestore(result.user, accountType)
      setError('')
      if (accountType === 'professional' || accountType === 'establishment') setStep(2)
      else navigate('/success')
    } catch (err) {
      setError('Erro ao criar conta com Google. Tenta novamente.')
      console.error(err)
    }
  }

  const handleCompleteProfile = async () => {
    const user = auth.currentUser

    if (accountType === 'professional') {
      if (!area || !location || languages.length === 0 || !description) { setError('Por favor preenche todos os campos!'); return }
      try {
        await addDoc(collection(db, 'professionals'), {
          ownerId: user.uid,
          name: user.displayName, email: user.email,
          photo: photo || user.photoURL || null,
          whatsapp: whatsapp || null,
          area, location, languages, category, description,
          yearsInIreland: parseInt(yearsInIreland) || 0,
          createdAt: new Date(),
        })
        navigate('/success')
      } catch (err) {
        setError('Erro ao guardar perfil. Tenta novamente.')
        console.error(err)
      }
    }

    if (accountType === 'establishment') {
      if (!establishmentName || !establishmentType || !address || !description) { setError('Por favor preenche todos os campos!'); return }
      try {
        await addDoc(collection(db, 'establishments'), {
          ownerId: user.uid,
          name: establishmentName, email: user.email,
          photo: photo || null,
          businessType: establishmentType,
          address,
          whatsapp: whatsapp || null,
          openingHours: JSON.stringify(openingHours),
          languages, category, description,
          createdAt: new Date(),
        })
        navigate('/success')
      } catch (err) {
        setError('Erro ao guardar estabelecimento. Tenta novamente.')
        console.error(err)
      }
    }
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

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 shadow-sm"

  const FormHeader = ({ subtitle }) => (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-black" style={{
        background: 'linear-gradient(135deg, #009c3b, #0d2b1a)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>ELOS</h1>
      <div className="flex justify-center gap-2 mt-2 mb-4">
        <div className="h-1 w-8 rounded-full bg-yellow-400"></div>
        <div className="h-1 w-8 rounded-full bg-green-600"></div>
        <div className="h-1 w-8 rounded-full" style={{ backgroundColor: '#169b62' }}></div>
      </div>
      <p className="text-gray-500">{subtitle}</p>
    </div>
  )

  if (step === 2 && accountType === 'professional') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: 'linear-gradient(135deg, #009c3b 0%, #0d2b1a 50%, #169b62 100%)' }}
      >
        <AnimatedSection direction="up" className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <FormHeader subtitle={t('completeProfile')} />
            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 text-center">{error}</div>}
            <div className="flex flex-col gap-4">
              <div className="flex justify-center mb-2">
                <PhotoUpload currentPhoto={null} onUploadComplete={(url) => setPhoto(url)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('workArea')}</label>
                <input type="text" value={area} onChange={(e) => setArea(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))} placeholder="Ex: Farmaceutica, Medico" className={inputClass} />
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
              <button onClick={handleCompleteProfile} className="w-full text-white py-4 rounded-2xl font-bold hover:opacity-90 transition shadow-lg mt-2" style={{ background: 'linear-gradient(135deg, #009c3b, #0d2b1a)' }}>
                {t('completeProfileButton')}
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    )
  }

  if (step === 2 && accountType === 'establishment') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: 'linear-gradient(135deg, #1a3a6b 0%, #0d2b1a 50%, #169b62 100%)' }}
      >
        <AnimatedSection direction="up" className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <FormHeader subtitle={t('registerEstablishment')} />
            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 text-center">{error}</div>}
            <div className="flex flex-col gap-4">
              <div className="flex justify-center mb-2">
                <PhotoUpload currentPhoto={null} onUploadComplete={(url) => setPhoto(url)} />
              </div>
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
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ex: 123 Patrick Street, Cork" className={inputClass} />
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
                      <select onChange={(e) => handleHoursChange(day, e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400 shadow-sm">
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
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                  {categoryOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('description')}</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="..." rows={4} className={inputClass} />
              </div>
              <button onClick={handleCompleteProfile} className="w-full text-white py-4 rounded-2xl font-bold hover:opacity-90 transition shadow-lg mt-2" style={{ background: 'linear-gradient(135deg, #1a3a6b, #0d2b1a)' }}>
                {t('registerEstablishmentButton')}
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #009c3b 0%, #0d2b1a 50%, #169b62 100%)' }}
    >
      <AnimatedSection direction="up" className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <FormHeader subtitle={t('registerTitle')} />
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 text-center">{error}</div>}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('accountType')}</label>
              <select value={accountType} onChange={(e) => setAccountType(e.target.value)} className={inputClass}>
                <option value="user">{t('userType')}</option>
                <option value="professional">{t('professionalType')}</option>
                <option value="establishment">{t('establishmentType')}</option>
              </select>
            </div>

            {accountType === 'user' && (
              <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-4 py-3">{t('userTypeDescription')}</p>
            )}
            {accountType === 'professional' && (
              <p className="text-sm text-gray-400 rounded-xl px-4 py-3" style={{ background: '#009c3b15' }}>{t('professionalTypeDescription')}</p>
            )}
            {accountType === 'establishment' && (
              <p className="text-sm text-gray-400 rounded-xl px-4 py-3" style={{ background: '#1a3a6b15' }}>{t('establishmentTypeDescription')}</p>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('fullName')}</label>
              <input type="text" value={name} onChange={(e) => setName(formatName(e.target.value))} placeholder="O teu nome" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('emailLabel')}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('passwordLabel')}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••" className={inputClass} />
              <p className="text-xs text-gray-400 mt-1">{t('passwordHint')}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('confirmPassword')}</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••••" className={inputClass} />
            </div>
            <button onClick={handleEmailRegister} className="w-full text-white py-4 rounded-2xl font-bold hover:opacity-90 transition shadow-lg" style={{ background: 'linear-gradient(135deg, #009c3b, #0d2b1a)' }}>
              {t('createAccount')}
            </button>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 text-sm">ou</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            <button onClick={handleGoogleRegister} className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 hover:bg-gray-50 transition font-semibold text-gray-700 shadow-sm">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              {t('registerWithGoogle')}
            </button>
          </div>
          <p className="text-center text-gray-500 text-sm mt-6">
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-green-600 font-bold hover:underline">{t('loginHere')}</Link>
          </p>
        </div>
      </AnimatedSection>
    </div>
  )
}

export default RegisterPage