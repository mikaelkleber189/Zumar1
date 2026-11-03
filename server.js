import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 10000;

// Configurações
app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

// Conexão com Gemini
const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey
    ? new GoogleGenAI({ apiKey })
    : null;

// Rota de comunicação com a IA
app.post('/api/chat', async (req, res) => {
    try {
        if (!ai) {
            return res.status(503).json({
                error: 'API do Gemini não configurada. Verifique GEMINI_API_KEY.'
            });
        }

        // Aceita message ou prompt
        const message =
            typeof req.body?.message === 'string'
                ? req.body.message.trim()
                : typeof req.body?.prompt === 'string'
                    ? req.body.prompt.trim()
                    : '';

        // Instruções do assistente
        const instructions =
            typeof req.body?.instructions === 'string'
                ? req.body.instructions.slice(0, 5000).trim()
                : 'Você é o Zumar, um assistente útil e inteligente. Responda em português brasileiro.';

        if (!message) {
            return res.status(400).json({
                error: 'Digite uma mensagem antes de enviar.'
            });
        }

        if (message.length > 12000) {
            return res.status(413).json({
                error: 'Mensagem muito longa.'
            });
        }

        // Chamada ao Gemini
        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
            contents: `${instructions}\n\nMensagem do usuário: ${message}`
        });

        return res.json({
            text: response.text || 'Não consegui gerar uma resposta.'
        });

    } catch (error) {
        console.error('Erro ao comunicar com o Gemini:', error);

        return res.status(500).json({
            error: 'Erro ao processar a mensagem. Verifique a API do Gemini.'
        });
    }
});

// Página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Zumar-para-celular.html'));
});

// Inicialização
app.listen(PORT, () => {
    console.log(`Zumar rodando na porta ${PORT}`);
});