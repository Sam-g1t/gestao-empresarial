import api from "./api";

// Buscar todos os produtos
export const getProdutos = async () => {
  const response = await api.get("/produtos");
  return response.data;
};

// Criar novo produto
export const createProduto = async (produto) => {
  const response = await api.post("/produtos", produto);
  return response.data;
};

// Atualizar produto
export const updateProduto = async (id, produto) => {
  const response = await api.put(`/produtos/${id}`, produto);
  return response.data;
};

// Excluir produto
export const deleteProduto = async (id) => {
  await api.delete(`/produtos/${id}`);
};
