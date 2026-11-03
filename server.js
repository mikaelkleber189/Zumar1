const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares essenciais
app.use(express.json());
app.use(cors());

// Porta injetada automaticamente pelo Render (ou 3000 localmente)
const PORT = process.env.PORT || 3000;

// Rota principal do chat
app.post('/api/chat', async (req, res) => {
    try {
        const { mensagem } = req.body;

        if (!mensagem) {
            return res.status(400).json({ erro: "A mensagem não pode estar vazia." });
        }

        // 1. Pega a chave do Environment do Render
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("ERRO: GEMINI_API_KEY não configurada.");
            return res.status(500).json({ erro: "Erro de configuração no servidor." });
        }

        // 2. URL oficial atualizada com o modelo exigido pelo erro (gemini-3.8-flash)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

        // 3. Monta o payload no formato exigido pela API
        const payload = {
            contents: [
                {
                    parts: [
                        { text: mensagem }
                    ]
                }
            ]
        };

        // 4. Requisição via fetch nativo do Node.js
        const apiResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await apiResponse.json();

        // 5. Validação de erro retornado pela API do Google
        if (!apiResponse.ok) {
            console.error("Erro retornado pela API do Google:", data);
            return res.status(500).json({ 
                erro: "Erro ao processar a mensagem. Verifique a API do Gemini",
                detalhes: data.error?.message || "Erro desconhecido"
            });
        }

        // 6. Extração segura da resposta
        const respostaTexto = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!respostaTexto) {
            console.error("Formato inesperado:", data);
            return res.status(500).json({ erro: "A resposta da IA veio em formato inválido." });
        }

        return res.json({ resposta: respostaTexto });

    } catch (error) {
        console.error("ERRO CRÍTICO NO CATCH:", error);
        return res.status(500).json({ 
            erro: "Erro ao processar a mensagem. Verifique a API do Gemini",
            excecao: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});