const express = require('express'); 
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Criar um novo fornecedor com verificação de CNPJ duplicado (sem senha)
router.post('/', (req, res) => {
    const { nome, cnpj, endereco, contato } = req.body;

    if (!nome || !cnpj) {
        return res.status(400).json({ erro: "Nome e CNPJ são obrigatórios." });
    }

    // Verifica se o CNPJ já está cadastrado
    db.get("SELECT * FROM fornecedores WHERE cnpj = ?", [cnpj], (err, row) => {
        if (err) return res.status(500).json({ erro: err.message });

        if (row) {
            return res.status(400).json({ erro: "CNPJ já cadastrado." });
        }

        // Se não existe, insere o novo fornecedor (sem senha)
        db.run(
            "INSERT INTO fornecedores (nome, cnpj, endereco, contato) VALUES (?, ?, ?, ?)", 
            [nome, cnpj, endereco, contato],
            function (err) {
                if (err) return res.status(500).json({ erro: err.message });
                res.status(201).json({ id: this.lastID });
            }
        );
    });
});

// Listar todos os fornecedores
router.get('/', (req, res) => {
    db.all("SELECT id, nome, cnpj, endereco, contato FROM fornecedores", [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

// Atualizar fornecedor (sem lógica de senha)
router.put('/:id', (req, res) => {
    const { nome, cnpj, endereco, contato } = req.body;

    db.get("SELECT * FROM fornecedores WHERE cnpj = ? AND id != ?", [cnpj, req.params.id], (err, row) => {
        if (err) return res.status(500).json({ erro: err.message });

        if (row) {
            return res.status(400).json({ erro: "Já existe outro fornecedor com este CNPJ." });
        }

        const sql = "UPDATE fornecedores SET nome = ?, cnpj = ?, endereco = ?, contato = ? WHERE id = ?";
        const params = [nome, cnpj, endereco, contato, req.params.id];

        db.run(sql, params, function (err) {
            if (err) return res.status(500).json({ erro: err.message });
            res.json({ mensagem: 'Fornecedor atualizado com sucesso' });
        });
    });
});

// Excluir fornecedor
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM fornecedores WHERE id = ?', id, function (err) {
        if (err) return res.status(500).json({ erro: err.message });

        if (this.changes === 0) {
            return res.status(404).json({ erro: "Fornecedor não encontrado" });
        }

        res.status(200).json({ mensagem: "Fornecedor excluído com sucesso" });
    });
});

module.exports = router;
