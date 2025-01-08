import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Mian from './Components/Mian'
import SingIn from './Components/SingIn'
import LogIn from './Components/LogIn';
import Upload from './Components/Upload';

function App() {

  return (
    <Container>
      <Router>
        <Routes>
          <Route path="/" element={<Mian />} />
          <Route path="/SingIn" element={<SingIn />} />
          <Route path="/LogIn" element={<LogIn />} />
          <Route path="/Upload" element={<Upload/>}/>
          
        </Routes>
      </Router>
    </Container>
  )
}

export default App
