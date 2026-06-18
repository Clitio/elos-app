import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useLanguage } from '../context/LanguageContext'
import AnimatedSection from '../components/AnimatedSection'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHeader from '../components/PageHeader'
import defaultAvatar from '../assets/defaultAvatar'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [userData, setUserData] = useState(null)
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser
      if (!user) {
        navigate('/login')
        return
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) setUserData(userDoc.data())

      const profQuery = query(collection(db, 'professionals'), where('ownerId', '==', user.uid))
      const profSnapshot = await getDocs(profQuery)
      const profData = profSnapshot.docs.map((d) => ({ id: d.id, profileType: 'professional', ...d.data() }))

      const estQuery = query(collection(db, 'establishments'), where('ownerId', '==', user.uid))
      const estSnapshot = await getDocs(estQuery)
      const estData = estSnapshot.docs.map((d) => ({ id: d.id, profileType: 'establishment', ...d.data() }))

      setProfiles([...profData, ...estData])
      setLoading(false)
    }

    fetchData()
  }, [navigate])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteProfile = async (profileId, profileType) => {
    if (!window.confirm(t('confirmDeleteProfile'))) return
    try {
      const collectionName = profileType === 'professional' ? 'professionals' : 'establishments'
      await deleteDoc(doc(db, collectionName, profileId))
      setProfiles(profiles.filter((p) => p.id !== profileId))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <PageHeader
        title={t('myProfileTitle')}
        subtitle={t('manageInfo')}
        gradient="dark"
      />

      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Info base do utilizador */}
        <AnimatedSection direction="up">
          <div className="bg-white rounded-3xl shadow-md overflow-hidden mb-6">
            <div className="h-24" style={{ background: 'linear-gradient(135deg, #009c3b, #0d2b1a)' }}></div>
            <div className="px-8 pb-6">
              <div className="flex items-end gap-4 -mt-10">
                <img
                  src={userData?.photo || auth.currentUser?.photoURL || defaultAvatar}
                  alt={userData?.name}
                  className="w-20 h-20 rounded-2xl border-4 border-white shadow-md object-cover"
                />
                <div className="mb-1">
                  <h2 className="text-2xl font-black text-gray-800">{userData?.name}</h2>
                  <p className="text-gray-400 text-sm">{userData?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Lista de perfis */}
        <AnimatedSection direction="up" delay={0.1}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-gray-800">{t('myProfiles')} ({profiles.length}/5)</h3>
          </div>
        </AnimatedSection>

        {profiles.length === 0 && (
          <AnimatedSection direction="up" delay={0.2}>
            <div className="bg-gray-50 rounded-3xl p-8 text-center mb-6">
              <p className="text-gray-400">Ainda nao tens perfis profissionais ou de estabelecimento.</p>
            </div>
          </AnimatedSection>
        )}

        <div className="flex flex-col gap-4 mb-6">
          {profiles.map((profile, index) => (
            <AnimatedSection key={profile.id} direction="up" delay={0.1 + index * 0.05}>
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="h-2" style={{
                  background: profile.profileType === 'establishment'
                    ? 'linear-gradient(135deg, #1a3a6b, #0d2b1a)'
                    : 'linear-gradient(135deg, #009c3b, #0d2b1a)'
                }}></div>
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={profile.photo || defaultAvatar}
                      alt={profile.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-green-400"
                    />
                    <div>
                      <p className="font-bold text-gray-800">{profile.name}</p>
                      <p className="text-green-600 text-sm font-semibold">{profile.area || profile.businessType}</p>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold mt-1 ${
                        profile.profileType === 'establishment' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {profile.profileType === 'establishment' ? t('establishments') : t('professionals')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/edit-profile/${profile.profileType}/${profile.id}`}
                      className="bg-green-50 text-green-600 border border-green-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-100 transition"
                    >
                      {t('editProfileButton')}
                    </Link>
                    <button
                      onClick={() => handleDeleteProfile(profile.id, profile.profileType)}
                      className="bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition"
                    >
                      {t('deleteProfile')}
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Botao adicionar novo perfil */}
        <AnimatedSection direction="up" delay={0.2}>
          {profiles.length < 5 ? (
            <Link
              to="/add-profile"
              className="block text-center text-white py-4 rounded-2xl font-bold hover:opacity-90 transition shadow-lg mb-3"
              style={{ background: 'linear-gradient(135deg, #ffdf00, #ff8c00)' }}
            >
              + {t('addNewProfile')}
            </Link>
          ) : (
            <p className="text-center text-gray-400 text-sm mb-3">{t('maxProfilesReached')}</p>
          )}
        </AnimatedSection>

        {/* Acoes */}
        <AnimatedSection direction="up" delay={0.3}>
          <div className="flex flex-col gap-3">
            <Link
              to="/directory"
              className="block text-center border-2 border-green-600 text-green-600 py-4 rounded-2xl font-bold hover:bg-green-50 transition"
            >
              {t('viewDirectoryButton')}
            </Link>
            <button
              onClick={handleLogout}
              className="w-full border-2 border-red-300 text-red-400 py-4 rounded-2xl font-bold hover:bg-red-50 transition"
            >
              {t('logoutButton')}
            </button>
          </div>
        </AnimatedSection>

      </div>
    </div>
  )
}

export default DashboardPage