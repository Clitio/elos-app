import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase'
import PhotoUpload from '../components/PhotoUpload'
import LanguageSelector from '../components/LanguageSelector'
import { containsBadWord } from '../utils/badWords'

const days = ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo']
const timeSlots = ['fechado', '08:00-17:00', '09:00-18:00', '10:00-19:00', '10:00-22:00', '12:00-22:00', '00:00-00:00']

const RegisterPage = () => {
  const navigate = useNavigate()
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
  const [establishmentName, setEstablishmentName] = useState('')
  const [establishmentType, setEstablishmentType] = useState('')
  const [address, setAddress] = useState('')
  const [openingHours, setOpeningHours] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (step === 1) {
          handleEmailRegister()
        } else if (step === 2) {
          handleCompleteProfile()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [step, name, email, password, confirmPassword, area, location, languages, description, yearsInIreland, establishmentName, establishmentType, address, openingHours])

  const formatName = (value) => {
    const exceptions = ['da', 'de', 'do', 'das', 'dos', 'des', 'e']
    return value
      .toLowerCase()
      .split(' ')
      .map((word, index) =>
        exceptions.includes(word) && index !== 0
          ? word
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(' ')
  }

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasMinLength = password.length >= 10
    return hasUpperCase && hasLowerCase && hasNumber && hasMinLength
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
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor preenche todos os campos!')
      return
    }
    if (containsBadWord(name)) {
      setError('O nome contem palavras inadequadas. Por favor escolhe outro nome.')
      return
    }
    if (!validateEmail(email)) {
      setError('Por favor insere um email valido.')
      return
    }
    if (!validatePassword(password)) {
      setError('A password deve ter no minimo 10 caracteres, letra maiuscula, letra minuscula e numero.')
      return
    }
    if (password !== confirmPassword) {
      setError('As passwords nao coincidem!')
      return
    }
    try {
      const formattedName = formatName(name)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName: formattedName })
      await saveUserToFirestore(result.user, accountType)
      setError('')
      if (accountType === 'professional' || accountType === 'establishment') {
        setStep(2)
      } else {
        navigate('/success')
      }
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
      if (accountType === 'professional' || accountType === 'establishment') {
        setStep(2)
      } else {
        navigate('/success')
      }
    } catch (err) {
      setError('Erro ao criar conta com Google. Tenta novamente.')
      console.error(err)
    }
  }

  const handleCompleteProfile = async () => {
    const user = auth.currentUser

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
          area: area,
          location: location,
          languages: languages,
          category: category,
          description: description,
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
          address: address,
          openingHours: JSON.stringify(openingHours),
          languages: languages,
          category: category,
          description: description,
          createdAt: new Date(),
        })
        navigate('/success')
      } catch (err) {
        setError('Erro ao guardar estabelecimento. Tenta novamente.')
        console.error(err)
      }
    }
  }

  if (step === 2 && accountType === 'professional') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-600">Elos</h1>
            <p className="text-gray-500 mt-2">Completa o teu perfil profissional</p>
          </div>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <div className="flex flex-col gap-4">
            <div className="flex justify-center mb-2">
              <PhotoUpload currentPhoto={null} onUploadComplete={(url) => setPhoto(url)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Area de trabalho</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                placeholder="Ex: Farmaceutica, Medico, Cabeleireira"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Localizacao em Cork</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ex: Cork City Centre, Douglas" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Idiomas que falas</label>
              <LanguageSelector selected={languages} onChange={setLanguages} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Anos na Irlanda</label>
              <input type="number" value={yearsInIreland} onChange={(e) => setYearsInIreland(e.target.value)} placeholder="Ex: 2" min={0} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Categoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400">
                <option value="health">Saude</option>
                <option value="food">Alimentacao</option>
                <option value="transport">Transporte</option>
                <option value="beauty">Beleza</option>
                <option value="community">Comunidade</option>
                <option value="accommodation">Acomodacao</option>
                <option value="daily">Dia a Dia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Descricao</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Conta um pouco sobre ti e como podes ajudar..." rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400" />
            </div>
            <button onClick={handleCompleteProfile} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition mt-2">Completar Perfil</button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 2 && accountType === 'establishment') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-600">Elos</h1>
            <p className="text-gray-500 mt-2">Regista o teu estabelecimento</p>
          </div>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <div className="flex flex-col gap-4">
            <div className="flex justify-center mb-2">
              <PhotoUpload currentPhoto={null} onUploadComplete={(url) => setPhoto(url)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do estabelecimento</label>
              <input type="text" value={establishmentName} onChange={(e) => setEstablishmentName(e.target.value)} placeholder="Ex: Restaurante Sabor Brasil" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de negocio</label>
              <input
                type="text"
                value={establishmentType}
                onChange={(e) => setEstablishmentType(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                placeholder="Ex: Restaurante, Loja, Salao de beleza"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Morada</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ex: 123 Patrick Street, Cork" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Horarios de funcionamento</label>
              <div className="flex flex-col gap-2">
                {days.map((day) => (
                  <div key={day} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-20">{day}</span>
                    <select
                      onChange={(e) => handleHoursChange(day, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-green-400"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Idiomas falados no estabelecimento</label>
              <LanguageSelector selected={languages} onChange={setLanguages} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Categoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400">
                <option value="health">Saude</option>
                <option value="food">Alimentacao</option>
                <option value="transport">Transporte</option>
                <option value="beauty">Beleza</option>
                <option value="community">Comunidade</option>
                <option value="accommodation">Acomodacao</option>
                <option value="daily">Dia a Dia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Descricao</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreve o teu estabelecimento..." rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400" />
            </div>
            <button onClick={handleCompleteProfile} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition mt-2">Registar Estabelecimento</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">Elos</h1>
          <p className="text-gray-500 mt-2">Cria a tua conta</p>
        </div>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de conta</label>
            <select value={accountType} onChange={(e) => setAccountType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400">
              <option value="user">Utilizador — Procuro servicos</option>
              <option value="professional">Profissional — Ofeco um servico pessoal</option>
              <option value="establishment">Estabelecimento — Tenho um negocio</option>
            </select>
          </div>

          {accountType === 'user' && (
            <p className="text-sm text-gray-400 bg-gray-50 rounded-lg px-4 py-3">
              Cria uma conta para encontrar profissionais e estabelecimentos brasileiros em Cork.
            </p>
          )}
          {accountType === 'professional' && (
            <p className="text-sm text-gray-400 bg-green-50 rounded-lg px-4 py-3">
              Apos criar a conta vais preencher os detalhes do teu perfil profissional como area de trabalho, idiomas e descricao.
            </p>
          )}
          {accountType === 'establishment' && (
            <p className="text-sm text-gray-400 bg-green-50 rounded-lg px-4 py-3">
              Apos criar a conta vais registar o teu negocio com nome, morada, horarios e descricao.
            </p>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome completo</label>
            <input type="text" value={name} onChange={(e) => setName(formatName(e.target.value))} placeholder="O teu nome" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="o-teu-email@email.com" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Cria uma password" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400" />
            <p className="text-xs text-gray-400 mt-1">Minimo 10 caracteres, com letra maiuscula, minuscula e numero.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmar Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repete a password" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400" />
          </div>
          <button onClick={handleEmailRegister} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">Criar Conta</button>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm">ou</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
          <button onClick={handleGoogleRegister} className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition font-semibold text-gray-700">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Registar com Google
          </button>
        </div>
        <p className="text-center text-gray-500 text-sm mt-6">
          Ja tens conta?{' '}
          <Link to="/login" className="text-green-600 font-semibold hover:underline">Entra aqui</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage