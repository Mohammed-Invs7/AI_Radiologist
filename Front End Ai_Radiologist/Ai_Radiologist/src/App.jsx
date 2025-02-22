import Home_Page from './Components/Home/Home_Page'
import Registration from './Components/Registration/Registration'
import Login from './Components/Registration/Login/Login'
import Upload_Page from './Components/Upload/Upload_Page'
import NavBar from './Components/NavBar/NavBar'
import ChooseProfilePic from './Components/ChooseProdilePic/ChooseProfilePic'
import Profile_Page from './Components/Profile/Profile_Page'
import './App.css'
import { Routes,Route } from 'react-router-dom'

function App() {

  return (
    <>
        <Routes>
          <Route  path="/" element={<Home_Page />} />
        <Route path="/Registration" element={<Registration />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Upload_Page" element={<Upload_Page />} />
        <Route path="NavBar" element={<NavBar />} />
        <Route path='ChooseProfilePic' element={<ChooseProfilePic />} />
        <Route path='Profile_Page' element={<Profile_Page />} />        
        </Routes>
    </>
  )
}

export default App
