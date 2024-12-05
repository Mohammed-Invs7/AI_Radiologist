import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();

  const goToSignIn = () => {
    navigate('/SingIn'); // التنقل إلى صفحة تسجيل الدخول
  };

  return (
    <Navbar expand="lg" className="navbar">
      <Container>
        <Navbar.Brand style={{ color: "#00a84f" }} as={Link} to="/">
          Ai-Radiologist
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav>
            <Nav.Link className='Nav-link' as={Link} to="/">Home</Nav.Link>
            <Nav.Link className='Nav-link' as={Link} to="/OueGoles">Our Goals</Nav.Link>
            <Nav.Link className='Nav-link' as={Link} to="/HowUseIt">How Use It</Nav.Link>
            <Nav.Link className='Nav-link' as={Link} to="/OurTeam">Our Team</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Button onClick={goToSignIn} className="bn31" variant="success">
          <span className="bn31span">SIGN IN</span>
        </Button>
      </Container>
    </Navbar>
  );
};

export default NavBar;
