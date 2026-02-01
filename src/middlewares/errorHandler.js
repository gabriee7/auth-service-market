import { HttpError } from '#errors/index.js';

export default function errorHandler(err, req, res) {
  if (err && err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Email already in use' });
  }

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err && err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error(err && err.stack ? err.stack : err);
  return res.status(500).json({ error: err && err.message ? err.message : 'Internal Server Error' });
}