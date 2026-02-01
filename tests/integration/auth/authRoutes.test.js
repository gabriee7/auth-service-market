import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import authRoutes from '#routes/authRoutes.js';
import errorHandler from '#middlewares/errorHandler.js';
import authService from '#services/authService.js';
import { UnauthorizedException } from '#errors/index.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

describe('Auth Routes', () => {
  beforeEach(() => jest.resetAllMocks());

  it('deve retornar 400 para payload inválido em POST /api/auth/login', async () => {
    // Arrange
    const payload = {};
    // Act
    const res = await request(app).post('/api/auth/login').send(payload);
    // Assert
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('deve retornar token e usuário quando credenciais válidas', async () => {
    // Arrange
    const dto = { email: 'a@example.com', password: 'secret' };
    const out = { token: 'tkn', user: { id: 'u1', name: 'A', email: dto.email } };
    authService.login = jest.fn().mockResolvedValue(out);

    // Act
    const res = await request(app).post('/api/auth/login').send(dto);

    // Assert
    expect(authService.login).toHaveBeenCalledWith(expect.objectContaining({ email: dto.email, password: dto.password }));
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token', 'tkn');
    expect(res.body).toHaveProperty('user');
  });

  it('deve retornar 401 para credenciais inválidas', async () => {
    // Arrange
    const dto = { email: 'nope@example.com', password: 'wrongpass' };
    authService.login = jest.fn().mockRejectedValue(new UnauthorizedException('Invalid credentials'));

    // Act
    const res = await request(app).post('/api/auth/login').send(dto);

    // Assert
    expect(authService.login).toHaveBeenCalledWith(expect.objectContaining({ email: dto.email, password: dto.password }));
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
