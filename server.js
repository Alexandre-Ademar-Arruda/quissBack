const express = require('express'); // Importa Express para criar servidor HTTP
const mongoose = require('mongoose'); // Importa Mongoose para modelar dados MongoDB
const cors = require('cors'); // Importa CORS para permitir requisições de outras origens
require('dotenv').config(); // Carrega variáveis do arquivo .env para process.env
require('./keepAlive');


const app = express();
app.use(cors()); // Permite CORS (requisicoes de outras origens)
app.use(express.json()); // Faz o Express interpretar JSON no body das requisições




// Conecta ao banco MongoDB usando URL do .env
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true, // Usa novo parser de URL
  useUnifiedTopology: true // Usa driver unificado de monitoramento
}).then(() => {
  console.log('✅ MongoDB conectado com sucesso!');
  console.log('🎯 Banco conectado:', mongoose.connection.name);

}).catch((err) => {
  console.error('❌ Erro ao conectar no MongoDB:', err);
});

// Define o schema das perguntas no banco
const PerguntaSchema = new mongoose.Schema({
  pergunta: String, // Texto da pergunta
  alternativas: Object, // Objeto com as alternativas A, B, C, D
  respostaCorreta: String, // Letra da resposta correta
  categoria: { type: String, default: 'geral' }, // Categoria opcional (default 'geral')
  nivel: { type: String, default: 'facil' } // Nível opcional (default 'facil')
});

// Cria modelo para a coleção perguntas
const Pergunta = mongoose.model('Pergunta', PerguntaSchema);

// Rota POST para adicionar nova pergunta ao banco
app.post('/adicionar-pergunta', async (req, res) => {
  const { pergunta, alternativas, respostaCorreta } = req.body;
  try {
    const nova = new Pergunta({
      pergunta,
      alternativas,
      respostaCorreta,
      categoria: 'geral',
      nivel: 'facil'
    });

    await nova.save(); // Salva no banco

    res.status(201).json({ mensagem: 'Pergunta salva com sucesso' }); // Resposta sucesso

  } catch (error) {
    res.status(500).json({ mensagem: '❌ Erro ao salvar pergunta', erro: error.message }); // Erro
  }
});

// Rota GET para buscar todas as perguntas no banco
app.get('/perguntas', async (req, res) => {
  try {
    const perguntas = await Pergunta.find(); // Busca todas perguntas
    res.json(perguntas); // Envia as perguntas no formato JSON
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar perguntas', erro: error.message }); // Erro
  }
});

// Inicializa servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
