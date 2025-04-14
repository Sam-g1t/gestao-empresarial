import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Alert } from 'react-bootstrap';

const Fornecedores = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [contato, setContato] = useState('');
  const [editando, setEditando] = useState(null);
  const [erro, setErro] = useState('');

  const carregarFornecedores = () => {
    axios.get('http://localhost:3001/fornecedores')
      .then(res => setFornecedores(res.data))
      .catch(err => console.error('Erro ao buscar fornecedores:', err));
  };

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const salvarFornecedor = () => {
    const dados = { nome, cnpj, endereco, contato };

    setErro('');

    const requisicao = editando
      ? axios.put(`http://localhost:3001/fornecedores/${editando}`, dados)
      : axios.post('http://localhost:3001/fornecedores', dados);

    requisicao.then(() => {
      carregarFornecedores();
      limparFormulario();
    }).catch(err => {
      if (err.response?.status === 400) {
        setErro(err.response.data.erro);
      } else if (err.response?.status === 500) {
        setErro('Erro interno do servidor.');
      } else {
        setErro('Erro ao salvar fornecedor.');
      }
    });
  };

  const excluirFornecedor = (id) => {
    if (window.confirm('Deseja excluir este fornecedor?')) {
      axios.delete(`http://localhost:3001/fornecedores/${id}`)
        .then(() => carregarFornecedores())
        .catch(() => setErro('Erro ao excluir fornecedor.'));
    }
  };

  const editarFornecedor = (fornecedor) => {
    setEditando(fornecedor.id);
    setNome(fornecedor.nome);
    setCnpj(fornecedor.cnpj);
    setEndereco(fornecedor.endereco);
    setContato(fornecedor.contato);
    setErro('');
  };

  const limparFormulario = () => {
    setEditando(null);
    setNome('');
    setCnpj('');
    setEndereco('');
    setContato('');
    setErro('');
  };

  return (
    <div className="container mt-4">
      <h2>Fornecedores</h2>

      {erro && <Alert variant="danger">{erro}</Alert>}

      <Form className="mb-3">
        <Form.Group>
          <Form.Label>Nome</Form.Label>
          <Form.Control value={nome} onChange={(e) => setNome(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>CNPJ</Form.Label>
          <Form.Control value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Endereço</Form.Label>
          <Form.Control value={endereco} onChange={(e) => setEndereco(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Contato</Form.Label>
          <Form.Control value={contato} onChange={(e) => setContato(e.target.value)} />
        </Form.Group>

        <Button variant="success" className="mt-2 me-2" onClick={salvarFornecedor}>
          {editando ? 'Atualizar' : 'Cadastrar'}
        </Button>
        {editando && (
          <Button variant="secondary" className="mt-2" onClick={limparFormulario}>
            Cancelar
          </Button>
        )}
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>Endereço</th>
            <th>Contato</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {fornecedores.map((fornecedor) => (
            <tr key={fornecedor.id}>
              <td>{fornecedor.nome}</td>
              <td>{fornecedor.cnpj}</td>
              <td>{fornecedor.endereco}</td>
              <td>{fornecedor.contato}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => editarFornecedor(fornecedor)}
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => excluirFornecedor(fornecedor.id)}
                >
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

export default Fornecedores;
