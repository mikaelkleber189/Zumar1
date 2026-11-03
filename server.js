const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());
app.use(express.static('public')); // Onde fica seu HTML/JS do front-end

// Inicializa o cliente do Gemini. 
// Ele vai buscar automaticamente a variável GEMINI_API_KEY do ambiente do Render.
const ai = new GoogleGenAI();

app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'O prompt é obrigatório.' });
        }

        // Chamada utilizando o modelo recomendado
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ text: response.text });
    } catch (error) {
        console.error('Erro ao comunicar com o Gemini:', error);
        res.status(500).json({ error: 'Erro interno ao processar a IA.' });
    }
});

app.get("/", (req, res) => {res.sendFile(path.join(__dirname, "Zumar-para-celular.html"
));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT`);
});
