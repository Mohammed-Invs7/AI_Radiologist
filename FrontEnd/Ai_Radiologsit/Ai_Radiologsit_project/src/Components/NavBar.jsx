import React from 'react'
import { Container, Nav, Navbar ,Button  } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css'

export default function NavBar() {
  return (
      <Navbar expand="lg" className="navbar">
  <Container >
    <Navbar.Brand style={{color:"#00a84f"}} href="#home">Ai-Radiologsit</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
      <Nav>
            <Nav.Link className='Nav-link' href="../Components/Mian.jsx">Home</Nav.Link>
            <Nav.Link className='Nav-link' href="../Components/Index2.jsx">Oue Goles</Nav.Link>
            <Nav.Link className='Nav-link' href="#How Use it">How Use it</Nav.Link>
            <Nav.Link className='Nav-link' href="#Oue Team">Oue Team</Nav.Link>
      </Nav>
    </Navbar.Collapse>
          <Button className='bn31' variant="success"><span className='bn31span'>SING IN</span></Button>{' '}

  </Container>
</Navbar>

  )
}

