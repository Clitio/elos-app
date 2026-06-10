import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'

import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import SearchPage from './pages/SearchPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SuccessPage from './pages/SuccessPage'
import DashboardPage from './pages/DashboardPage'
import EditProfilePage from './pages/EditProfilePage'
import TalkToUsPage from './pages/TalkToUsPage'
import DirectoryPage from './pages/DirectoryPage'
import CommunityPage from './pages/CommunityPage'
import FoodPage from './pages/FoodPage'
import HealthPage from './pages/HealthPage'
import AccommodationPage from './pages/AccommodationPage'
import DailyBasisPage from './pages/DailyBasisPage'
import TransportPage from './pages/TransportPage'
import BeautyPage from './pages/BeautyPage'
import ProfessionalDetailsPage from './pages/ProfessionalDetailsPage'
import AdminPage from './pages/AdminPage'

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Rotas publicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/food" element={<FoodPage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/accommodation" element={<AccommodationPage />} />
        <Route path="/daily-basis" element={<DailyBasisPage />} />
        <Route path="/transport" element={<TransportPage />} />
        <Route path="/beauty" element={<BeautyPage />} />
        <Route path="/professional/:id" element={<ProfessionalDetailsPage />} />

        {/* Rotas privadas */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/edit-profile" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
        <Route path="/success" element={<PrivateRoute><SuccessPage /></PrivateRoute>} />
        <Route path="/talk-to-us" element={<PrivateRoute><TalkToUsPage /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
      </Routes>
    </Router>
  )
}

export default App