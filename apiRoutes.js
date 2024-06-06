import express from 'express';
import { contacts, subscription } from './index.js';

const router = express.Router();

router.post('/contacts',contacts);
router.post('/subscription',subscription);

export default router;