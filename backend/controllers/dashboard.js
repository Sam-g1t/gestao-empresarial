const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Rota que retorna o total de produtos e fornecedores em "/dashboard"
router.get('/', (req, res) => {
  const estatisticas = {};

  db.get("SELECT COUNT(*) AS total FROM produtos", (err, row) => {
    if (err) return res.status(500).json({ erro: err.message });
    estatisticas.produtos = row.total;

    db.get("SELECT COUNT(*) AS total FROM fornecedores", (err, row) => {
      if (err) return res.status(500).json({ erro: err.message });
      estatisticas.fornecedores = row.total;

      res.json(estatisticas);
    });
  });
});

module.exports = router;
