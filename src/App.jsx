//here lies the BRAIN behind the site. The one in charge of deciding what page will be loaded on the screen

import React from 'react'
//library in charge of the SPA. This import intercepts the user click and changes the JS on screen
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
//Vital components present in almost every page on the site
import NavBar from './components/Navbar'
//This one in particular protects the confidencial pages of the site
import PrivateRoute from './components/PrivateRoute'

//All those imports come from pages created by us.
//They stay here on stand by waiting to be called by the user
//Those are like the actors waiting for their own screen-time
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
import NotFoundPage from './pages/NotFoundPage'
import AddProfilePage from './pages/AddProfilePage'

const App = () => {
  return (
    //It must be the first in onder to guide the subsequent ones
    <Router>
      {/* Navbar outside of Routes helps us to save processing time since It's never destroyed while
      travelling through the pages */}
      <NavBar />
      <Routes>
        {/* Almost like an if statement. If the URL changes, It cleans erase the old page and injects the requested one */}
        {/* Public routes*/}
        {/* Routes that can be accesed by any user */}
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

        {/* Private Routes */}
        {/* Routes only accesible by the proper user, under proper circunstances */}
        {/* This structured checks if the user is logged in order to access their page
        JS checks with Firebase if the user is logged. */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/edit-profile" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
        <Route path="/success" element={<PrivateRoute><SuccessPage /></PrivateRoute>} />
        <Route path="/talk-to-us" element={<PrivateRoute><TalkToUsPage /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
        <Route path="/add-profile" element={<PrivateRoute><AddProfilePage /></PrivateRoute>} />
        {/* If the user looks for a page that doesn't exist, React throws this page instead of crashing */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App