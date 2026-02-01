import { jest } from '@jest/globals';
import authService from '#services/authService.js';
import authRepository from '#repositories/authRepository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '#errors/index.js';

describe('authService', () => {
  beforeEach(() => jest.resetAllMocks());

  const makeUserRow = (overrides = {}) => ({
    id: overrides.id || 'u-1',
    name: overrides.name || 'Alice',
    email: overrides.email || 'alice@example.com',
    password: overrides.password || 'hashed'
  });

  it('deve autenticar e retornar token e usuário', async () => {
    // Arrange
    process.env.JWT_SECRET = 'test-secret';
    const user = makeUserRow();
    authRepository.findUserByEmail = jest.fn().mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(jwt, 'sign').mockReturnValue('token-abc');
    // Action
    const res = await authService.login({ email: user.email, password: 'plain' });
    // Assert
    expect(authRepository.findUserByEmail).toHaveBeenCalledWith(user.email);
    expect(bcrypt.compare).toHaveBeenCalledWith('plain', user.password);
    expect(jwt.sign).toHaveBeenCalledWith(expect.objectContaining({ id: user.id, email: user.email }), process.env.JWT_SECRET, expect.any(Object));
    expect(res).toHaveProperty('token', 'token-abc');
    expect(res).toHaveProperty('user');
    expect(res.user).toEqual({ id: user.id, name: user.name, email: user.email });
  });

  it('não deve autenticar quando usuário não existe', async () => {
    // Arrange
    authRepository.findUserByEmail = jest.fn().mockResolvedValue(null);
    // Action & Assert
    await expect(authService.login({ email: 'nope', password: 'x' })).rejects.toThrow(UnauthorizedException);
  });

  it('não deve autenticar quando senha inválida', async () => {
    // Arrange
    const user = makeUserRow();
    authRepository.findUserByEmail = jest.fn().mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
    // Action & Assert
    await expect(authService.login({ email: user.email, password: 'wrong' })).rejects.toThrow(UnauthorizedException);
  });
});
