// Importa o módulo nativo 'https' do Node.js
// Ele permite fazer requisições HTTPS (como acessar um site seguro)
const https = require('https');

// Importa a classe 'URL' do módulo nativo 'url'
// Usamos isso para validar e manipular URLs
const { URL } = require('url');

// ✅ Define a URL pública da sua aplicação no Render que você quer manter "acordada"
const RENDER_URL = 'https://quiss.onrender.com';

// Cria um objeto URL para analisar a string da URL acima
const parsedURL = new URL(RENDER_URL);

// Verifica se a URL usa o protocolo HTTPS (por segurança e compatibilidade com o módulo https)
if (parsedURL.protocol !== 'https:') {
  // Se não for HTTPS, lança um erro e para a execução
  throw new Error('A URL precisa começar com https://');
}

// Declara a função que será usada para enviar um "ping" (requisição GET) à sua URL
function pingRender() {
  // Faz uma requisição GET para a URL da aplicação no Render
  https.get(RENDER_URL, res => {
    // Quando a resposta chegar, mostra no console o horário e o código de status HTTP (200 = OK)
    console.log(`[${new Date().toISOString()}] Ping → status ${res.statusCode}`);

    // Escuta os dados da resposta, mas os ignora (descarta) para não ocupar memória
    res.on('data', () => {});
  }).on('error', err => {
    // Se der erro na requisição (ex: sem internet ou URL fora do ar), mostra o erro no console
    console.error(`[Ping ERROR] ${err.message}`);
  });
}

// Define o intervalo de tempo entre os pings
// 14 minutos = 14 * 60 * 1000 milissegundos
const INTERVAL = 13 * 60 * 1000;

// Envia o primeiro ping imediatamente ao iniciar o script
pingRender();

// Programa a função pingRender para rodar novamente a cada 14 minutos
setInterval(pingRender, INTERVAL);

// Exporta a função pingRender (opcional, útil se quiser usar ela em outro arquivo)
module.exports = pingRender;
