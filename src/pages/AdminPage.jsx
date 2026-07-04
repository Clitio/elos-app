import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase'
import { useLanguage } from '../context/LanguageContext'
import PageHeader from '../components/PageHeader'
import AnimatedSection from '../components/AnimatedSection'
import LoadingSpinner from '../components/LoadingSpinner'
import defaultAvatar from '../assets/defaultAvatar'

const AdminPage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [professionals, setProfessionals] = useState([])
  const [establishments, setEstablishments] = useState([])
  const [bannedEmails, setBannedEmails] = useState([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) { navigate('/login'); return }

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        if (!userDoc.exists() || !userDoc.data().isAdmin) { navigate('/'); return }

        const usersSnapshot = await getDocs(collection(db, 'users'))
        setUsers(usersSnapshot.docs.map((d) => ({ id: d.id, ...d.data() })))

        const profSnapshot = await getDocs(collection(db, 'professionals'))
        setProfessionals(profSnapshot.docs.map((d) => ({ id: d.id, ...d.data() })))

        const estSnapshot = await getDocs(collection(db, 'establishments'))
        setEstablishments(estSnapshot.docs.map((d) => ({ id: d.id, ...d.data() })))

        const bannedSnapshot = await getDocs(collection(db, 'bannedEmails'))
        setBannedEmails(bannedSnapshot.docs.map((d) => ({ id: d.id, ...d.data() })))

        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [navigate])

  const handleDeleteUser = async (id) => {
    if (!window.confirm(t('confirmDeleteUser'))) return
    try {
      await deleteDoc(doc(db, 'users', id))
      setUsers(users.filter((u) => u.id !== id))
    } catch (err) { console.error(err) }
  }

  const handleDeleteProfessional = async (id) => {
    if (!window.confirm(t('confirmDeleteProfessional'))) return
    try {
      await deleteDoc(doc(db, 'professionals', id))
      setProfessionals(professionals.filter((p) => p.id !== id))
    } catch (err) { console.error(err) }
  }

  const handleDeleteEstablishment = async (id) => {
    if (!window.confirm(t('confirmDeleteEstablishment'))) return
    try {
      await deleteDoc(doc(db, 'establishments', id))
      setEstablishments(establishments.filter((e) => e.id !== id))
    } catch (err) { console.error(err) }
  }

  const handleBanUser = async (user) => {
    if (!window.confirm(t('confirmBan'))) return
    try {
      const emailKey = user.email.replace(/\./g, '_').replace(/@/g, '_at_')
      await setDoc(doc(db, 'bannedEmails', emailKey), {
        email: user.email,
        name: user.name,
        bannedAt: new Date(),
        reason: 'Banido pelo admin',
      })
      setBannedEmails([...bannedEmails, { id: emailKey, email: user.email, name: user.name }])
      setUsers(users.map((u) => u.id === user.id ? { ...u, isBanned: true } : u))
    } catch (err) { console.error(err) }
  }

  const handleUnbanUser = async (bannedUser) => {
    if (!window.confirm(t('confirmUnban'))) return
    try {
      await deleteDoc(doc(db, 'bannedEmails', bannedUser.id))
      setBannedEmails(bannedEmails.filter((b) => b.id !== bannedUser.id))
    } catch (err) { console.error(err) }
  }

  const isEmailBanned = (email) => {
    if (!email) return false
    const emailKey = email.replace(/\./g, '_').replace(/@/g, '_at_')
    return bannedEmails.some((b) => b.id === emailKey)
  }

  if (loading) return <LoadingSpinner />

  const tabs = [
    { key: 'users', label: `${t('usersLabel')} (${users.length})` },
    { key: 'professionals', label: `${t('professionals')} (${professionals.length})` },
    { key: 'establishments', label: `${t('establishments')} (${establishments.length})` },
    { key: 'banned', label: `${t('bannedUsers')} (${bannedEmails.length})` },
  ]

  return (
    <div>
      <PageHeader title={t('adminTitle')} subtitle={t('adminSubtitle')} gradient="dark" />

      <div className="max-w-6xl mx-auto px-6 py-12">

        <AnimatedSection direction="up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {[
              { label: t('usersLabel'), value: users.length, gradient: 'linear-gradient(135deg, #009c3b, #0d2b1a)' },
              { label: t('professionals'), value: professionals.length, gradient: 'linear-gradient(135deg, #1a3a6b, #0d2b1a)' },
              { label: t('establishments'), value: establishments.length, gradient: 'linear-gradient(135deg, #ffdf00, #ff8c00)' },
              { label: t('bannedUsers'), value: bannedEmails.length, gradient: 'linear-gradient(135deg, #dc2626, #7f1d1d)' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl p-6 text-center shadow-lg" style={{ background: stat.gradient }}>
                <p className="text-4xl font-black text-white">{stat.value}</p>
                <p className="text-white opacity-80 mt-1 font-semibold text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={0.1}>
          <div className="flex gap-2 mb-8 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition ${
                  activeTab === tab.key ? 'text-white shadow-lg' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
                style={activeTab === tab.key ? {
                  background: tab.key === 'banned'
                    ? 'linear-gradient(135deg, #dc2626, #7f1d1d)'
                    : 'linear-gradient(135deg, #009c3b, #0d2b1a)'
                } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Usuários */}
        {activeTab === 'users' && (
          <div className="flex flex-col gap-4">
            {users.length === 0 && (
              <AnimatedSection direction="up">
                <p className="text-gray-400 text-center py-10">{t('noUsersFound')}</p>
              </AnimatedSection>
            )}
            {users.map((user, index) => (
              <AnimatedSection key={user.id} direction="up" delay={index * 0.05}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5 flex items-center justify-between hover:shadow-lg transition">
                  <div className="flex items-center gap-4">
                    <img src={user.photo || defaultAvatar} alt={user.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-green-400" />
                    <div>
                      <p className="font-bold text-gray-800">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          user.accountType === 'professional' ? 'bg-green-100 text-green-700' :
                          user.accountType === 'establishment' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {user.accountType === 'professional' ? t('professionals') :
                           user.accountType === 'establishment' ? t('establishments') : 'Usuário'}
                        </span>
                        {user.isAdmin && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-yellow-100 text-yellow-700">Admin</span>
                        )}
                        {isEmailBanned(user.email) && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-red-100 text-red-600">{t('banned')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!user.isAdmin && (
                    <div className="flex gap-2">
                      {!isEmailBanned(user.email) ? (
                        <button
                          onClick={() => handleBanUser(user)}
                          className="bg-orange-50 text-orange-600 border border-orange-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-100 transition"
                        >
                          {t('banUser')}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnbanUser(bannedEmails.find(b => b.email === user.email))}
                          className="bg-green-50 text-green-600 border border-green-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-100 transition"
                        >
                          {t('unbanUser')}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition"
                      >
                        {t('deleteButton')}
                      </button>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}

        {/* Profissionais */}
        {activeTab === 'professionals' && (
          <div className="flex flex-col gap-4">
            {professionals.length === 0 && (
              <AnimatedSection direction="up">
                <p className="text-gray-400 text-center py-10">{t('noProfessionalsFound')}</p>
              </AnimatedSection>
            )}
            {professionals.map((p, index) => (
              <AnimatedSection key={p.id} direction="up" delay={index * 0.05}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="h-2" style={{ background: 'linear-gradient(135deg, #009c3b, #0d2b1a)' }}></div>
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={p.photo || defaultAvatar} alt={p.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-green-400" />
                      <div>
                        <p className="font-bold text-gray-800">{p.name}</p>
                        <p className="text-green-600 text-sm font-semibold">{p.area}</p>
                        <p className="text-gray-400 text-sm">{p.email}</p>
                        <p className="text-gray-400 text-sm">📍 {p.location}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteProfessional(p.id)}
                      className="bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition"
                    >
                      {t('deleteButton')}
                    </button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}

        {/* Estabelecimentos */}
        {activeTab === 'establishments' && (
          <div className="flex flex-col gap-4">
            {establishments.length === 0 && (
              <AnimatedSection direction="up">
                <p className="text-gray-400 text-center py-10">{t('noEstablishmentsFound')}</p>
              </AnimatedSection>
            )}
            {establishments.map((e, index) => (
              <AnimatedSection key={e.id} direction="up" delay={index * 0.05}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="h-2" style={{ background: 'linear-gradient(135deg, #1a3a6b, #0d2b1a)' }}></div>
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={e.photo || defaultAvatar} alt={e.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-400" />
                      <div>
                        <p className="font-bold text-gray-800">{e.name}</p>
                        <p className="text-blue-600 text-sm font-semibold">{e.businessType}</p>
                        <p className="text-gray-400 text-sm">{e.email}</p>
                        <p className="text-gray-400 text-sm">📍 {e.address}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEstablishment(e.id)}
                      className="bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition"
                    >
                      {t('deleteButton')}
                    </button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}

        {/* Banidos */}
        {activeTab === 'banned' && (
          <div className="flex flex-col gap-4">
            {bannedEmails.length === 0 && (
              <AnimatedSection direction="up">
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">{t('noBannedUsers')}</p>
                </div>
              </AnimatedSection>
            )}
            {bannedEmails.map((banned, index) => (
              <AnimatedSection key={banned.id} direction="up" delay={index * 0.05}>
                <div className="bg-white rounded-2xl border border-red-100 shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="h-2" style={{ background: 'linear-gradient(135deg, #dc2626, #7f1d1d)' }}></div>
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-red-500 text-2xl">
                        🚫
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{banned.name || 'Sem nome'}</p>
                        <p className="text-red-500 text-sm">{banned.email}</p>
                        {banned.bannedAt && (
                          <p className="text-gray-400 text-xs mt-1">
                            Banido em: {new Date(banned.bannedAt.seconds * 1000).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnbanUser(banned)}
                      className="bg-green-50 text-green-600 border border-green-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-100 transition"
                    >
                      {t('unbanUser')}
                    </button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminPage