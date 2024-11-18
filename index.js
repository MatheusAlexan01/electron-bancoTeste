const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();

const port = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'teste1',
    password: 'BemVindo!',
});

app.use(express.static(path.join(__dirname, 'app')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'inicial.html'));
});

app.post('/', async (req, res) => {
    const { nome, placa, tipo, cor, horario_entrada } = req.body;
    const queryText = 'INSERT INTO entrada_veiculos (proprietario, placa, tipo, cor, horario_entrada) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [nome, placa, tipo, cor, horario_entrada];

    try {
        const result = await pool.query(queryText, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao cadastrar veículo:', err);
        res.status(500).send('Erro interno ao processar a solicitação');
    }
});

// Rota para obter registros em JSON
app.get('/api/veiculos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM entrada_veiculos');
        res.json(result.rows);
    } catch (err) {
        res.status(400).send(err);
    }
});


app.delete('/api/veiculos', async (req, res) => {
    const { placa } = req.query; // Use req.query para acessar parâmetros de consulta
    try {
        const result = await pool.query('DELETE FROM entrada_veiculos WHERE placa = $1 RETURNING *', [placa]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Veículo deletado com sucesso!' });
        } else {
            res.status(404).json({ message: 'Veículo não encontrado!' });
        }
    } catch (err) {
        console.error('Erro ao deletar veículo:', err);
        res.status(500).send('Erro interno ao processar a solicitação');
    }
});

app.post('/pagamento', async (req, res) => {
    const { nome, placa, horarioEntrada, horarioSaida, tempoTotal, valorPagar, mensagemResultado, statusPagamento, dataPagamento } = req.body;

    // Debug: Log para verificar os dados recebidos
    console.log(req.body);

    const queryText = `
        INSERT INTO pagamento_veiculo (nome, placa, horario_entrada, horario_saida, tempo_total, valor_pago, mensagem_resultado, status_pagamento, data_pagamento)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;

    const values = [nome, placa, horarioEntrada, horarioSaida, tempoTotal, valorPagar, mensagemResultado, statusPagamento, dataPagamento];

    try {
        const result = await pool.query(queryText, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao salvar pagamento:', err);
        res.status(500).send('Erro interno ao processar a solicitação');
    }
});


app.get('/registros', async (req, res) => {
    const queryText = 'SELECT * FROM pagamento_veiculo';

    try {
        const result = await pool.query(queryText);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar registros:', err);
        res.status(500).send('Erro interno ao processar a solicitação');
    }
});



  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
