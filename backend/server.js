const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./database.db');

// Middlewares
app.use(cors());
app.use(express.json());

// Importa os controllers
const produtosRouter = require('./controllers/produtos');
const fornecedoresRouter = require('./controllers/fornecedores');
const associacoesRouter = require('./controllers/associacoes');
const dashboardRouter = require('./controllers/dashboard');

// Define as rotas
app.use('/produtos', produtosRouter);
app.use('/fornecedores', fornecedoresRouter);
app.use('/associacoes', associacoesRouter);
app.use('/dashboard', dashboardRouter);

// Criação das tabelas se não existirem
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco REAL,
    codigo_barras TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS fornecedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cnpj TEXT UNIQUE,
    endereco TEXT,
    contato TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS produto_fornecedor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER,
    fornecedor_id INTEGER,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
  )`);

  console.log('Tabelas verificadas ou criadas com sucesso.');
});

// Rota raiz
app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// Inicia o servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
