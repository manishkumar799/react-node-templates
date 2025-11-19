import { Router } from 'express';
import { getTestToken, getTokenInfo } from './testToken.controller.js';

const router = Router();

// Generate test token
router.get('/token', getTestToken);

// Token info/help
router.get('/', getTokenInfo);

export default router;
