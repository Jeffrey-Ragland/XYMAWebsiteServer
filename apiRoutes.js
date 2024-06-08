import express from 'express';
import { contacts, subscription ,Check, adminSignup, adminLogin, validateToken} from './index.js';

const router = express.Router();

router.post('/contacts',contacts);
router.post('/subscription',subscription);
router.get('/check',Check);
router.get('/adminsignup',adminSignup);
router.post('/adminlogin',adminLogin);
router.post('/validatetoken',validateToken);

export default router;