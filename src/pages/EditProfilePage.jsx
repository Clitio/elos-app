import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import PhotoUpload from '../components/PhotoUpload'
import LanguageSelector from '../components/LanguageSelector'

const days = ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo']
const timeSlots = ['fechado', '08:00-17:00', '09:00-18:00', '10:00-19:00', '10:00-22:00', '12:00-22:00', '00:00-00:00']

const EditProfilePage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
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
      if (e.key === 'Enter') {
        handleSave()
      }
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
        navigate('/dashboard')
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
          area: area,
          location: location,
          languages: languages,
          category: category,
          description: description,
          yearsInIreland: parseInt(yearsInIreland) || 0,
        }, { merge: true })
        navigate('/dashboard')
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
        }, { merge: true })
        navigate('/dashboard')
      } catch (err) {
        setError('Erro ao guardar estabelecimento. Tenta novamente.')
        console.error(err)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-lg">A carregar...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Editar Perfil</h1>
        <p className="text-gray-500 mt-2">Atualiza as tuas informacoes</p>
      </div>

      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="flex flex-col gap-4">

          {accountType === 'user' && (
            <>
              <div className="flex justify-center mb-2">
                <PhotoUpload
                  currentPhoto={userPhoto}
                  onUploadComplete={(url) => setUserPhoto(url)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nome completo</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="O teu nome"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400"
                />
              </div>
            </>
          )}

          {accountType === 'professional' && (
            <>
              <div className="flex justify-center mb-2">
                <PhotoUpload
                  currentPhoto={photo}
                  onUploadComplete={(url) => setPhoto(url)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Area de trabalho</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Localizacao em Cork</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Idiomas que falas</label>
                <LanguageSelector selected={languages} onChange={setLanguages} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Anos na Irlanda</label>
                <input type="number" value={yearsInIreland} onChange={(e) => setYearsInIreland(e.target.value)} min={0} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400" />
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
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400" />
              </div>
            </>
          )}

          {accountType === 'establishment' && (
            <>
              <div className="flex justify-center mb-2">
                <PhotoUpload
                  currentPhoto={photo}
                  onUploadComplete={(url) => setPhoto(url)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do estabelecimento</label>
                <input type="text" value={establishmentName} onChange={(e) => setEstablishmentName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de negocio</label>
                <input
                  type="text"
                  value={establishmentType}
                  onChange={(e) => setEstablishmentType(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Morada</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Horarios de funcionamento</label>
                <div className="flex flex-col gap-2">
                  {days.map((day) => (
                    <div key={day} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-20">{day}</span>
                      <select
                        value={openingHours[day] || 'fechado'}
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
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400" />
              </div>
            </>
          )}

          <div className="flex gap-4 mt-2">
            <button onClick={handleSave} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">Guardar Alteracoes</button>
            <Link to="/dashboard" className="flex-1 text-center border border-gray-300 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">Cancelar</Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default EditProfilePage