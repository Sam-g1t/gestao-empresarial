const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Rota para retornar o total de produtos e fornecedores
router.get('/', (req, res) => {
  db.serialize(() => {
    let totalProdutos = 0;
    let totalFornecedores = 0;

    db.get("SELECT COUNT(*) AS total FROM produtos", (err, row) => {
      if (err) return res.status(500).json({ erro: err.message });
      totalProdutos = row.total;

      db.get("SELECT COUNT(*) AS total FROM fornecedores", (err2, row2) => {
        if (err2) return res.status(500).json({ erro: err2.message });
        totalFornecedores = row2.total;

        res.json({
          totalProdutos,
          totalFornecedores
        });
      });
    });
  });
});

module.exports = router;
