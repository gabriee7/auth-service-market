import { jest, describe, it, expect, beforeEach, beforeAll } from '@jest/globals';

const mockExecute = jest.fn();
const mockPool = { execute: mockExecute };

jest.unstable_mockModule('#config/database.js', () => ({ default: mockPool }));

let authRepository;
beforeAll(async () => {
  const mod = await import('#repositories/authRepository.js');
  authRepository = mod.default;
});

beforeEach(() => {
  mockExecute.mockReset();
});

describe('authRepository.findUserByEmail', () => {
  it('returns user when found', async () => {
    // Arrange
    const fakeUser = { id: '1', email: 'a@b.com', password: 'hash' };
    mockExecute.mockResolvedValue([[fakeUser], undefined]);
    // Actionion
    const result = await authRepository.findUserByEmail('a@b.com');
    // Assert
    expect(mockExecute).toHaveBeenCalledWith(expect.any(String), ['a@b.com']);
    expect(result).toEqual(fakeUser);
  });

  it('returns null when no user found', async () => {
    // Arrange
    mockExecute.mockResolvedValue([[], undefined]);
    // Action
    const result = await authRepository.findUserByEmail('notfound@x.com');
    // Assert
    expect(mockExecute).toHaveBeenCalledWith(expect.any(String), ['notfound@x.com']);
    expect(result).toBeNull();
  });

  it('propagates errors from the pool', async () => {
    // Arrange
    const err = new Error('DB failure');
    mockExecute.mockRejectedValue(err);
    // Action
    const call = authRepository.findUserByEmail('x');
    // Assert
    await expect(call).rejects.toThrow('DB failure');
  });
});
