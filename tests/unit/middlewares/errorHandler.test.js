import request from 'supertest';
import express from 'express';
import errorHandler from '#middlewares/errorHandler.js';
import { NotFoundException } from '#errors/index.js';

const app = express();
app.use(express.json());

app.get('/not-found', (req, res, next) => {
  // Arrange & Action
  next(new NotFoundException('Usuário não encontrado'));
});

app.get('/dup', (req, res, next) => {
  // Arrange & Action
  const e = new Error('Duplicate');
  e.code = 'ER_DUP_ENTRY';
  next(e);
});

app.use(errorHandler);

describe('errorHandler middleware', () => {
  it('não deve retornar 500 quando NotFoundException for lançada', async () => {
    // Action
    const res = await request(app).get('/not-found');
    // Assert
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Usuário não encontrado');
  });

  it('não deve retornar 500 quando erro ER_DUP_ENTRY for lançado', async () => {
    // Action
    const res = await request(app).get('/dup');
    // Assert
    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error', 'Email already in use');
  });
});