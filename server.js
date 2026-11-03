import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 10000;
app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
app.post('/api/chat', async (req, res) => {
  try {
    if (!client) return res.status(503).json({ error: 'API ainda não configurada. Adicione OPENAI_API_KEY no arquivo .env do servidor.' });
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    const instructions = typeof req.body?.instructions === 'string' ? req.body.instructions.slice(0, 5000) : 'Você é o assistente Zumar. Responda em português brasileiro.';
    if (!message) return res.status(400).json({ error: 'Envie uma mensagem.' });
    if (message.length > 12000) return res.status(413).json({ error: 'A mensagem é muito longa. Limite: 12.000 caracteres.' });
    const result = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-6-astra',
      instructions,
      input: message,
      max_output_tokens: 2500
    });
    res.json({ text: result.output_text || 'Não consegui gerar uma resposta. Tente novamente.' });
  } catch (error) {
    console.error('Erro na rota /api/chat:', error?.message || error);
    res.status(500).json({ error: 'Ocorreu um erro ao consultar a IA. Verifique a configuração do servidor e tente novamente.' });
  }
});
app.listen(port, () => console.log(`Zumar disponível em http://localhost:${port}`));
