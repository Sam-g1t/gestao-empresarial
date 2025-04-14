import React, { useEffect, useState } from "react";
import { getProdutos, deleteProduto } from "../services/produtoService";

const ProdutoList = () => {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const data = await getProdutos();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduto(id);
      fetchProdutos(); // Atualiza a lista após deletar
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };

  return (
    <div>
      <h2>Lista de Produtos</h2>
      <ul>
        {produtos.map((produto) => (
          <li key={produto.id}>
            {produto.nome} - R$ {produto.preco.toFixed(2)}
            <button onClick={() => handleDelete(produto.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProdutoList;
