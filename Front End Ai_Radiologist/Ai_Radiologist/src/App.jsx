import Home_Page from './Pages/Home_Page'
import Registration from './Pages/Registration'
import Login from './Pages/Login'
import Upload_Page from './Pages/Upload_Page'
import NavBar from './Components/NavBar'
import Profile_Page from './Pages/Profile_Page'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './Components/ProtectedRoute'
import VerifyEmail from './Pages/VerifyEmail'
function App() {

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route  path="/" element={<Home_Page />} />
          <Route path="/Registration" element={<Registration />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Upload_page" element={<ProtectedRoute><Upload_Page/></ProtectedRoute>} />
          <Route path="NavBar" element={<NavBar />} />
          <Route path='Profile_Page' element={<Profile_Page />} />        
        </Routes>
        </AuthProvider>
    </>
  )
}

export default App
