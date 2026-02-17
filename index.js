import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './src/routes/index.js';
import errorHandler from './src/middlewares/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Rotas agrupadas
const basePath = process.env.BASE_PATH || '/';
app.use(basePath, routes);

// Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('\x1b[41m%s\x1b[0m', `Servidor rodando na porta ${PORT}`);
});
