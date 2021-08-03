import React from "react";
import {Button, Form, FormControl, Nav, Navbar, NavDropdown} from 'react-bootstrap';

const NavbarPage = (props) => {
  return (
    <>
      <Navbar bg="light" expand="lg" sticky="top">
        <Navbar.Brand href="#home">WES</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav.Link className="text-dark" href="/signin">Signin</Nav.Link>
          <Nav.Link className="text-dark" href="/signup">Signup</Nav.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default NavbarPage;
