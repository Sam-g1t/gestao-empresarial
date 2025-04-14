import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Alert } from 'react-bootstrap';

const Associacoes = () => {
  const [associacoes, setAssociacoes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [produtoId, setProdutoId] = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [erro, setErro] = useState('');

  const carregarDados = () => {
    axios.get('http://localhost:3001/associacoes').then(res => setAssociacoes(res.data));
    axios.get('http://localhost:3001/produtos').then(res => setProdutos(res.data));
    axios.get('http://localhost:3001/fornecedores').then(res => setFornecedores(res.data));
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const salvarAssociacao = () => {
    setErro('');

    axios.post('http://localhost:3001/associacoes', {
      produto_id: produtoId,
      fornecedor_id: fornecedorId
    }).then(() => {
      carregarDados();
      setProdutoId('');
      setFornecedorId('');
    }).catch(err => {
      if (err.response && err.response.status === 400) {
        setErro(err.response.data.erro);
      } else {
        setErro('Erro ao salvar associação.');
      }
    });
  };

  const excluirAssociacao = (id) => {
    if (window.confirm('Deseja excluir esta associação?')) {
      axios.delete(`http://localhost:3001/associacoes/${id}`)
        .then(() => carregarDados())
        .catch(() => setErro('Erro ao excluir associação.'));
    }
  };

  return (
    <div className="container mt-4">
      <h2>Associações</h2>

      {erro && <Alert variant="danger">{erro}</Alert>}

      <Form className="mb-3">
        <Form.Group>
          <Form.Label>Produto</Form.Label>
          <Form.Select value={produtoId} onChange={(e) => setProdutoId(e.target.value)}>
            <option value="">Selecione</option>
            {produtos.map(produto => (
              <option key={produto.id} value={produto.id}>{produto.nome}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Fornecedor</Form.Label>
          <Form.Select value={fornecedorId} onChange={(e) => setFornecedorId(e.target.value)}>
            <option value="">Selecione</option>
            {fornecedores.map(fornecedor => (
              <option key={fornecedor.id} value={fornecedor.id}>{fornecedor.nome}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button variant="success" className="mt-2" onClick={salvarAssociacao}>
          Cadastrar Associação
        </Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Produto</th>
            <th>Fornecedor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {associacoes.map(assoc => (
            <tr key={assoc.id}>
              <td>{assoc.id}</td>
              <td>{assoc.produto_nome}</td>
              <td>{assoc.fornecedor_nome}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => excluirAssociacao(assoc.id)}>
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Associacoes;
