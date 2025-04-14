import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Alert } from 'react-bootstrap';

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [editando, setEditando] = useState(null);
  const [erro, setErro] = useState('');

  const carregarProdutos = () => {
    axios.get('http://localhost:3001/produtos')
      .then(res => setProdutos(res.data))
      .catch(err => console.error('Erro ao buscar produtos:', err));
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const salvarProduto = () => {
    const dados = { nome, descricao, preco, codigo_barras: codigoBarras };
    setErro('');

    const requisicao = editando
      ? axios.put(`http://localhost:3001/produtos/${editando}`, dados)
      : axios.post('http://localhost:3001/produtos', dados);

    requisicao.then(() => {
      carregarProdutos();
      limparFormulario();
    }).catch(err => {
      if (err.response && err.response.status === 400) {
        setErro(err.response.data.erro);
      } else {
        setErro('Erro ao salvar produto.');
      }
    });
  };

  const excluirProduto = (id) => {
    if (window.confirm('Deseja excluir este produto?')) {
      axios.delete(`http://localhost:3001/produtos/${id}`)
        .then(() => carregarProdutos())
        .catch(() => setErro('Erro ao excluir produto.'));
    }
  };

  const editarProduto = (produto) => {
    setEditando(produto.id);
    setNome(produto.nome);
    setDescricao(produto.descricao);
    setPreco(produto.preco);
    setCodigoBarras(produto.codigo_barras);
    setErro('');
  };

  const limparFormulario = () => {
    setEditando(null);
    setNome('');
    setDescricao('');
    setPreco('');
    setCodigoBarras('');
    setErro('');
  };

  return (
    <div className="container mt-4">
      <h2>Produtos</h2>

      {erro && <Alert variant="danger">{erro}</Alert>}

      <Form className="mb-3">
        <Form.Group>
          <Form.Label>Nome</Form.Label>
          <Form.Control value={nome} onChange={(e) => setNome(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Descrição</Form.Label>
          <Form.Control value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Preço</Form.Label>
          <Form.Control value={preco} onChange={(e) => setPreco(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Código de Barras</Form.Label>
          <Form.Control value={codigoBarras} onChange={(e) => setCodigoBarras(e.target.value)} />
        </Form.Group>

        <Button variant="success" className="mt-2 me-2" onClick={salvarProduto}>
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
            <th>Descrição</th>
            <th>Preço</th>
            <th>Código de Barras</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.nome}</td>
              <td>{produto.descricao}</td>
              <td>{produto.preco}</td>
              <td>{produto.codigo_barras}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => editarProduto(produto)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => excluirProduto(produto.id)}
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

export default Produtos;
