import Home from './Pages/Home'
import Registration from './Pages/Registration'
import Login from './Pages/Login'
import Upload from './Pages/Upload'
import NavBar from './Components/NavBar'
import Profile_User from './Pages/Profile_User'
import Settings_User from './Pages/Settings_User'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './Components/ProtectedRoute'
import VerifyEmail from './Pages/VerifyEmail'
import ForgotPassword from './Pages/ForgotPassword'
import ResetPassword from './Pages/ResetPassword'

function App() {

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Registration" element={<Registration />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
          <Route path="/Upload" element={<ProtectedRoute><Upload/></ProtectedRoute>} />
          <Route path="NavBar" element={<NavBar />} />
          <Route path='Profile_User' element={<ProtectedRoute><Profile_User /></ProtectedRoute>} /> 
          <Route path='Settings_User' element={<ProtectedRoute><Settings_User/></ProtectedRoute>} />        

        </Routes>
        </AuthProvider>
    </>
  )
}

export default App
