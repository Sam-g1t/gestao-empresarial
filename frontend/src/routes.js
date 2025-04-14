import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
} from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

import Produtos from "./pages/Produtos";
import Fornecedores from "./pages/Fornecedores";
import Associacoes from "./pages/Associacoes";
import Dashboard from "./pages/Dashboard";

const AppRoutes = () => {
  return (
    <Router>
      <div>
        <h1 className="text-center mt-3">Gestão Empresarial</h1>

        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
          <Container>
            <Navbar.Brand as={Link} to="/">
              Sistema
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">
                  Produtos
                </Nav.Link>
                <Nav.Link as={Link} to="/fornecedores">
                  Fornecedores
                </Nav.Link>
                <Nav.Link as={Link} to="/associacoes">
                  Associações
                </Nav.Link>
                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container>
          <Routes>
            <Route path="/" element={<Produtos />} />
            <Route path="/fornecedores" element={<Fornecedores />} />
            <Route path="/associacoes" element={<Associacoes />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
};

export default AppRoutes;
