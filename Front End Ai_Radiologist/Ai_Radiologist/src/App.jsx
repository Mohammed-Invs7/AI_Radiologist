import Home_Page from './Components/Home/Home_Page'
import Registration from './Components/Registration/Registration'
import Login from './Components/Registration/Login/Login'
import Upload_Page from './Components/Upload/Upload_Page'
import NavBar from './Components/NavBar/NavBar'
import Profile_Page from './Components/Profile/Profile_Page'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './Components/ProtectedRoute'

function App() {

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route  path="/" element={<Home_Page />} />
        <Route path="/Registration" element={<Registration />} />
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
