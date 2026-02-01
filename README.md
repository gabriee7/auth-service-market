# auth-service-market-api

Microserviço de autenticação em Node.js + Express. Responsável por validar credenciais e emitir/verificar JWTs.

**Pré-requisitos**

- Node.js 20+ 

## Variáveis de ambiente

Crie um arquivo `.env` com pelo menos as variáveis abaixo:

- `PORT` (opcional, padrão 3000)
- `DB_HOST` — host do MySQL
- `DB_USER` — usuário do MySQL
- `DB_PASSWORD` — senha do MySQL
- `DB_NAME` — nome do banco
- `DB_PORT` (opcional, padrão 3306)
- `JWT_SECRET` — segredo para assinar tokens (OBRIGATÓRIO para `login`/`verify` em runtime)
- `JWT_EXPIRY` (opcional, formato compatível com `jsonwebtoken`, ex: `1h`, `3600s`; padrão aplicado no serviço)

## Instalação

```bash
npm install
```

## Rodar localmente

Desenvolvimento:

```bash
npm run dev
```

Executar:

```bash
npm start
```

O serviço por padrão expõe a documentação OpenAPI/Swagger em `http://localhost:3000/api/docs`.

## Testes

Executar a suíte (unit + integration):

```bash
npm test
```

Observações sobre testes:
- Os testes de repositório isolam o banco mockando o pool exportado em `src/config/database.js`.

## API

Base path: `/api/auth`

1) POST `/api/auth/login`

- Descrição: valida credenciais e retorna um JWT com informações do usuário.
- Payload (JSON):

```json
{
  "email": "alice@example.com",
  "password": "secret"
}
```

- Response 200 (exemplo):

```json
{
  "token": "eyJ...",
  "expiresAt": "2026-02-01T16:00:00.000Z",
  "user": {
    "id": "uuid-v4",
    "email": "alice@example.com"
  }
}
```

Notas:
- O campo `user` contém apenas informações não sensíveis (não inclui `password`).
- `expiresAt` é a data/hora de expiração do token em ISO-8601.

2) POST `/api/auth/verify`

- Descrição: valida um JWT enviado no corpo `{ token: "..." }` ou no header `Authorization: Bearer <token>`.
- Payload (JSON):

```json
{ "token": "eyJ..." }
```

- Response 200 (exemplo):

```json
{
  "valid": true,
  "expiresAt": "2026-02-01T16:00:00.000Z",
  "payload": { "sub": "uuid-v4", "email": "alice@example.com", "iat": 1675257600 }
}
```

Response 401 é retornado para tokens inválidos/expirados.

## Observações de implementação

- Senhas: comparadas com `bcryptjs.compare` e nunca retornadas nas respostas.
- Erros: o middleware global padroniza respostas JSON com formato `{ error: 'mensagem' }`.
- Repositório: `src/repositories/authRepository.js` consulta a tabela `users` por email. Nos testes, o pool é mockado para evitar dependência de um banco real.

## Docker

Construir e rodar a imagem:

```bash
docker build -t auth-service-market-api .
docker run -p 3000:3000 --env-file .env auth-service-market-api
```

## Estrutura importante

- `index.js` — bootstrap do app e mount das rotas + Swagger
- `src/routes/authRoutes.js` — rotas de autenticação
- `src/controllers/authController.js` — handlers HTTP
- `src/services/authService.js` — regras de autenticação (login/verify)
- `src/repositories/authRepository.js` — acesso ao MySQL
- `src/config/database.js` — pool MySQL (mockável nos testes)
- `tests/` — testes unitários e de integração (jest + supertest)
