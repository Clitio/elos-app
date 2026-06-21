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
  const dropdownRef = useRef(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data())
        }
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
    navigate('/')
  }

  return (
    <nav className="bg-green-600 shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-white text-2xl font-bold">Elos</Link>

        <div className="flex items-center gap-4">
          <Link to="/about" className="text-white hover:underline text-sm">{t('about')}</Link>
          <Link to="/search" className="text-white hover:underline text-sm">{t('search')}</Link>
          <Link to="/talk-to-us" className="text-white hover:underline text-sm">{t('talkToUs')}</Link>

          <button
            onClick={toggleLanguage}
            className="text-white border border-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
          >
            {language === 'pt' ? 'EN' : 'PT'}
          </button>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={userData?.photo || user.photoURL || defaultAvatar}
                  alt={userData?.name || user.displayName}
                  className="w-9 h-9 rounded-full border-2 border-white object-cover"
                />
                <span className="text-white text-sm font-semibold hidden md:block">
                  {userData?.name || user.displayName}
                </span>
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
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-green-50 text-sm font-semibold"
                  >
                    {t('myProfile')}
                  </Link>
                  <Link to="/edit-profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-green-50 text-sm">
                  {t('editProfile')}
                  </Link>
                  {userData?.isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-3 text-yellow-600 hover:bg-yellow-50 text-sm font-semibold"
                    >
                      {t('adminDashboard')}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-b-xl text-sm"
                  >
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-white hover:underline text-sm">{t('login')}</Link>
              <Link to="/register" className="bg-white text-green-600 px-4 py-1 rounded font-semibold text-sm">{t('register')}</Link>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-6 px-6 py-2 bg-green-700 overflow-x-auto">
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