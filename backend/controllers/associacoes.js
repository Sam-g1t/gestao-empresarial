const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Criar associação entre produto e fornecedor com verificação de duplicidade
router.post('/', (req, res) => {
  const { produto_id, fornecedor_id } = req.body;

  // Verifica se essa associação já existe
  db.get(
    "SELECT * FROM produto_fornecedor WHERE produto_id = ? AND fornecedor_id = ?",
    [produto_id, fornecedor_id],
    (err, row) => {
      if (err) return res.status(500).json({ erro: err.message });
      if (row) return res.status(400).json({ erro: 'Esta associação já existe' });

      db.run(
        "INSERT INTO produto_fornecedor (produto_id, fornecedor_id) VALUES (?, ?)",
        [produto_id, fornecedor_id],
        function (err) {
          if (err) return res.status(500).json({ erro: err.message });
          res.json({ id: this.lastID });
        }
      );
    }
  );
});

// Listar todas as associações com nomes de produto e fornecedor
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      pf.id,
      pf.produto_id,
      pf.fornecedor_id,
      p.nome AS produto_nome,
      f.nome AS fornecedor_nome
    FROM produto_fornecedor pf
    JOIN produtos p ON pf.produto_id = p.id
    JOIN fornecedores f ON pf.fornecedor_id = f.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

// Deletar uma associação
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM produto_fornecedor WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ mensagem: 'Associação deletada com sucesso' });
  });
});

module.exports = router;
