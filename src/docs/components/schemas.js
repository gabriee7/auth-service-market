const schemas = {
  AuthUser: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' }
    }
  },
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email', example: 'joao@example.com' },
      password: { type: 'string', format: 'password', example: 'senha123' }
    }
  },
  LoginResponse: {
    type: 'object',
    properties: {
      token: { type: 'string' },
      expirationTime: { type: 'string', format: 'date-time', description: 'Token expiration time in ISO 8601' },
      user: { $ref: '#/components/schemas/AuthUser' }
    }
  },
  VerifyRequest: {
    type: 'object',
    required: ['token'],
    properties: {
      token: { type: 'string' }
    }
  },
  VerifyResponse: {
    type: 'object',
    properties: {
      valid: { type: 'boolean' },
      expirationTime: { type: 'string', format: 'date-time' },
      payload: { type: 'object' }
    }
  },
  Error: {
    type: 'object',
    properties: {
      error: { type: 'string' }
    }
  }
};

export default schemas;