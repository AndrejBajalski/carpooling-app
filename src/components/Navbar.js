import React from "react";
import { Button, Navbar, Container, Nav} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import {useAuth} from "./AuthContext"
import logo from '../logo/brand.jpg'

export const CustomNavbar = ({dashboard, search, create})=>{
    const navigate=useNavigate();
    const {logout}=useAuth();
    const logoutHandler = async()=>{
        await logout()
        console.log('User logged out')
        navigate('/signIn')
    }

    return(
    <Navbar expand='lg'>
      <Container>
        <Navbar.Brand as={Link} to="/"><img style={{maxWidth: '73px'}} src={logo} alt='brand logo'/></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="links">
            <Nav.Link as={Link} to="/" style={{borderBottom: dashboard? '2px solid white':'none'}}>Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/search" style={{borderBottom: search? '2px solid white':'none'}}>Search rides</Nav.Link>
            <Nav.Link as={Link} to="/create" style={{borderBottom: create? '2px solid white':'none'}}>Create a ride</Nav.Link>
            <Button onClick={logoutHandler} className="btn-light mt-2 signout" >
              Sign Out
           </Button>
          </Nav>
        </Navbar.Collapse>
        </Container>
    </Navbar>
    )
}