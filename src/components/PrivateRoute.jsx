import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import LoadingSpinner from '../components/LoadingSpinner'

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  if (user === undefined) return <LoadingSpinner />

  if (!user) return <Navigate to="/login" />

  return children
}

export default PrivateRoute