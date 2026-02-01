import express from 'express';
import authController from '#controllers/authController.js';
import { validateAuth } from '#middlewares/authValidation.js';

const router = express.Router();

router.post('/login', validateAuth, authController.login);
router.post('/verify', authController.verify);

export default router;
