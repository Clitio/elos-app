import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useLanguage } from '../context/LanguageContext'
import defaultAvatar from '../assets/defaultAvatar'

const NavBar = () => {
  const navigate = useNavigate()
  const { language, toggleLanguage, t } = useLanguage()
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        if (userDoc.exists()) setUserData(userDoc.data())
      } else {
        setUserData(null)
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    setDropdownOpen(false)
    setMobileMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className="bg-green-600 shadow-md relative z-50">

      {/* Barra principal */}
      <div className="flex justify-between items-center px-4 py-3">
        <Link to="/" className="text-white text-2xl font-black tracking-widest">ELOS</Link>

        <div className="flex items-center gap-2">
          {/* Botao de idioma */}
          <button
            onClick={toggleLanguage}
            className="text-white border border-white px-2 py-1 rounded-lg text-xs font-semibold hover:bg-green-700 transition"
          >
            {language === 'pt' ? 'EN' : 'PT'}
          </button>

          {/* Avatar em desktop */}
          {user && (
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 focus:outline-none">
                <img
                  src={userData?.photo || user.photoURL || defaultAvatar}
                  alt={userData?.name || user.displayName}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <span className="text-white text-sm font-semibold">{userData?.name || user.displayName}</span>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{userData?.name || user.displayName}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-green-50 text-sm font-semibold">{t('myProfile')}</Link>
                  <Link to="/edit-profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-green-50 text-sm">{t('editProfile')}</Link>
                  {userData?.isAdmin && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)} className="block px-4 py-3 text-yellow-600 hover:bg-yellow-50 text-sm font-semibold">{t('adminDashboard')}</Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-b-xl text-sm">{t('logout')}</button>
                </div>
              )}
            </div>
          )}

          {/* Links login/register em desktop */}
          {!user && (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/about" className="text-white hover:underline text-sm">{t('about')}</Link>
              <Link to="/search" className="text-white hover:underline text-sm">{t('search')}</Link>
              <Link to="/talk-to-us" className="text-white hover:underline text-sm">{t('talkToUs')}</Link>
              <Link to="/login" className="text-white hover:underline text-sm">{t('login')}</Link>
              <Link to="/register" className="bg-white text-green-600 px-3 py-1 rounded-lg font-semibold text-sm">{t('register')}</Link>
            </div>
          )}

          {/* Links desktop quando logado */}
          {user && (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/about" className="text-white hover:underline text-sm">{t('about')}</Link>
              <Link to="/search" className="text-white hover:underline text-sm">{t('search')}</Link>
              <Link to="/talk-to-us" className="text-white hover:underline text-sm">{t('talkToUs')}</Link>
            </div>
          )}

          {/* Botao hamburguer mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-1 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-green-700 px-4 py-4 flex flex-col gap-3">
          {user && (
            <div className="flex items-center gap-3 pb-3 border-b border-green-600">
              <img
                src={userData?.photo || user.photoURL || defaultAvatar}
                alt={userData?.name}
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
              <div>
                <p className="text-white font-bold text-sm">{userData?.name || user.displayName}</p>
                <p className="text-green-200 text-xs">{user.email}</p>
              </div>
            </div>
          )}

          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-white text-sm py-1">Home</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-white text-sm py-1">{t('about')}</Link>
          <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="text-white text-sm py-1">{t('search')}</Link>
          <Link to="/directory" onClick={() => setMobileMenuOpen(false)} className="text-white text-sm py-1">{t('directory')}</Link>
          <Link to="/health" onClick={() => setMobileMenuOpen(false)} className="text-white text-sm py-1">{t('health')}</Link>
          <Link to="/food" onClick={() => setMobileMenuOpen(false)} className="text-white text-sm py-1">{t('food')}</Link>
          <Link to="/transport" onClick={() => setMobileMenuOpen(false)} className="text-white text-sm py-1">{t('transport')}</Link>
          <Link to="/beauty" onClick={() => setMobileMenuOpen(false)} className="text-white text-sm py-1">{t('beauty')}</Link>
          <Link to="/community" onClick={() => setMobileMenuOpen(false)} className="text-white text-sm py-1">{t('community')}</Link>
          <Link to="/accommodation" onClick={() => setMobileMenuOpen(false)} className="text-white text-sm py-1">{t('accommodation')}</Link>
          <Link to="/daily-basis" onClick={() => setMobileMenuOpen(false)} className="text-white text-sm py-1">{t('dailyBasis')}</Link>

          <div className="border-t border-green-600 pt-3 flex flex-col gap-3">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-white text-sm py-1 font-semibold">{t('myProfile')}</Link>
                <Link to="/edit-profile" onClick={() => setMobileMenuOpen(false)} className="text-white text-sm py-1">{t('editProfile')}</Link>
                <Link to="/talk-to-us" onClick={() => setMobileMenuOpen(false)} className="text-white text-sm py-1">{t('talkToUs')}</Link>
                {userData?.isAdmin && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-yellow-300 text-sm py-1 font-semibold">{t('adminDashboard')}</Link>
                )}
                <button onClick={handleLogout} className="text-left text-red-300 text-sm py-1">{t('logout')}</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-white text-sm py-1">{t('login')}</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="bg-white text-green-600 px-4 py-2 rounded-xl font-semibold text-sm text-center">{t('register')}</Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Barra de categorias — apenas desktop */}
      <div className="hidden md:flex gap-6 px-6 py-2 bg-green-700 overflow-x-auto">
        <Link to="/directory" className="text-white text-sm whitespace-nowrap hover:underline">{t('directory')}</Link>
        <Link to="/community" className="text-white text-sm whitespace-nowrap hover:underline">{t('community')}</Link>
        <Link to="/food" className="text-white text-sm whitespace-nowrap hover:underline">{t('food')}</Link>
        <Link to="/health" className="text-white text-sm whitespace-nowrap hover:underline">{t('health')}</Link>
        <Link to="/accommodation" className="text-white text-sm whitespace-nowrap hover:underline">{t('accommodation')}</Link>
        <Link to="/daily-basis" className="text-white text-sm whitespace-nowrap hover:underline">{t('dailyBasis')}</Link>
        <Link to="/transport" className="text-white text-sm whitespace-nowrap hover:underline">{t('transport')}</Link>
        <Link to="/beauty" className="text-white text-sm whitespace-nowrap hover:underline">{t('beauty')}</Link>
      </div>

    </nav>
  )
}

export default NavBar