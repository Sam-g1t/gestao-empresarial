import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';

const Dashboard = () => {
  const [totais, setTotais] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/dashboard') // 👈 Certo, agora sabemos que essa rota está funcionando!
      .then(res => {
        console.log("Resposta do backend:", res.data); // 👈 pode deixar para debug
        setTotais(res.data);
        setCarregando(false);
      })
      .catch(err => {
        console.error('Erro ao buscar dados do dashboard:', err);
        setCarregando(false);
      });
  }, []);

  return (
    <Container className="mt-4">
      <h2>Dashboard</h2>

      {carregando ? (
        <div className="text-center mt-4">
          <Spinner animation="border" variant="primary" />
          <p>Carregando estatísticas...</p>
        </div>
      ) : (
        <Row className="mt-4">
          <Col md={6}>
            <Card bg="info" text="white" className="mb-3 shadow">
              <Card.Body>
                <Card.Title>Total de Produtos</Card.Title>
                <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {totais.produtos} {/* 👈 Corrigido */}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card bg="success" text="white" className="mb-3 shadow">
              <Card.Body>
                <Card.Title>Total de Fornecedores</Card.Title>
                <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {totais.fornecedores} {/* 👈 Corrigido */}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Dashboard;
