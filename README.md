# Zumar — starter de plataforma

## O que já está incluído
- Interface responsiva com identidade visual Zumar.
- Navegação entre início, chat, ferramentas e conta.
- Ferramentas de geração de sites, planilhas, agendas, documentos, estudos e negócios.
- Chat e resultados com IA via endpoint `/api/chat`.
- Histórico simples salvo no navegador.
- Perfil demonstrativo local (não é autenticação real).
- Exportação de resultados em `.txt`.

## Executar localmente
Requer Node.js 20 ou superior.

```bash
npm install
cp .env.example .env
```
Edite `.env` e defina `OPENAI_API_KEY` com uma chave criada na plataforma da OpenAI. A chave deve permanecer no servidor, nunca no HTML.

```bash
npm start
```
Abra `http://localhost:3000`.

## Importante antes de publicar
Este projeto é um starter funcional, não um produto pronto para produção. O login é apenas demonstrativo e os dados ficam no navegador. Para lançar publicamente, implemente autenticação real (por exemplo, Supabase Auth ou outro provedor), banco de dados para usuários/conversas, autorização por usuário, limitação de requisições, proteção contra abuso, monitoramento, política de privacidade e termos de uso. Configure limites de gastos na conta de API.

O modelo padrão está definido em `OPENAI_MODEL` e pode ser trocado por um modelo habilitado no seu projeto de API.
