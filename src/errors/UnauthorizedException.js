import { StatusCodes } from 'http-status-codes';
import HttpError from './HttpError.js';

export default class UnauthorizedException extends HttpError {
  constructor(message = 'Unauthorized') {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}
