import authService from '#services/authService.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestException } from '#errors/index.js';

const authController = {
  async login(req, res) {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return res.status(StatusCodes.OK).json(result);
  },
  async verify(req, res) {
    let token = req.body && req.body.token;
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) token = parts[1];
    }
    if (!token) throw new BadRequestException('Token not provided');
    const result = await authService.verify(token);
    return res.status(StatusCodes.OK).json(result);
  }
};

export default authController;
