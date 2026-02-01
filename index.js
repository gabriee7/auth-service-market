import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';
import errorHandler from './src/middlewares/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import openapiSpec from './src/docs/openapi.js';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Rotas agrupadas
app.use('/api/auth', authRoutes);

// Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('\x1b[41m%s\x1b[0m', `Servidor rodando na porta ${PORT}`);
});
