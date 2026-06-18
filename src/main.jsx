//the second step on EVERY React application
//StrictMode works on the backstage, telling on the F12 what's wrong
import { StrictMode } from 'react'
//the master in charge of "translate" JS to a proper React and make it readable
import { createRoot } from 'react-dom/client'
//Tailwind being created on the main page are automaticly injected to the others pages
import './index.css'
//Those two are the esqueleton of the website, being brought to the main page
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
//Traditional JS being used to find the root previously created
//inject this root into React and render everything
createRoot(document.getElementById('root')).render(
  //StrictMode taking everything in order to check the erros into all of those steps
  <StrictMode>
    {/* The translation heart. Since App is inside of it, all routes of the app will be able to 
    to execute the translation technique */}
    <LanguageProvider>
      {/* The REAL HERO of the whole application. This guy will read the actual URL and decide which page
      to be thrown inside of it*/}
      <App />
    </LanguageProvider>
  </StrictMode>,
)