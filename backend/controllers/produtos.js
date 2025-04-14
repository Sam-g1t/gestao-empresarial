const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Buscar todos os produtos
router.get('/', (req, res) => {
  db.all("SELECT * FROM produtos", [], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

// Criar novo produto com verificação de duplicidade
router.post('/', (req, res) => {
  const { nome, descricao, preco, codigo_barras } = req.body;

  // Verifica se já existe um produto com o mesmo código de barras
  db.get("SELECT * FROM produtos WHERE codigo_barras = ?", [codigo_barras], (err, row) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (row) return res.status(400).json({ erro: 'Código de barras já cadastrado' });

    db.run(
      "INSERT INTO produtos (nome, descricao, preco, codigo_barras) VALUES (?, ?, ?, ?)",
      [nome, descricao, preco, codigo_barras],
      function (err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(201).json({ id: this.lastID });
      }
    );
  });
});

// Atualizar produto
router.put('/:id', (req, res) => {
  const { nome, descricao, preco, codigo_barras } = req.body;

  db.run(
    "UPDATE produtos SET nome = ?, descricao = ?, preco = ?, codigo_barras = ? WHERE id = ?",
    [nome, descricao, preco, codigo_barras, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ mensagem: 'Produto atualizado com sucesso' });
    }
  );
});

// Deletar produto
router.delete('/:id', (req, res) => {
  db.run("DELETE FROM produtos WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ mensagem: 'Produto deletado com sucesso' });
  });
});

module.exports = router;