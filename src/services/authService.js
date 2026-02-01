import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authRepository from '#repositories/authRepository.js';
import { UnauthorizedException } from '#errors/index.js';

const TOKEN_EXPIRY = process.env.JWT_EXPIRY || '1h';

const authService = {
  async login({ email, password }) {
    const user = await authRepository.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) throw new UnauthorizedException('Invalid credentials');
    const payload = { id: user.id, email: user.email };
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');
    const token = jwt.sign(payload, secret, { expiresIn: TOKEN_EXPIRY });
    const decoded = jwt.decode(token);
    const expirationTime = decoded && decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null;
    const safeUser = { id: user.id, name: user.name, email: user.email };
    return { token, expirationTime, user: safeUser };
  },
  async verify(token) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');
    try {
      const decoded = jwt.verify(token, secret);
      const expirationTime = decoded && decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null;
      return { valid: true, expirationTime, payload: decoded };
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
};

export default authService;
