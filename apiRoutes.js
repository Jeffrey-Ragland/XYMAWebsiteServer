import express from 'express';
import { contacts, subscription ,Check, adminSignup, adminLogin, validateToken, addPosition, getPosition, deletePosition, updatePosition} from './index.js';

const router = express.Router();

router.post('/contacts',contacts);
router.post('/subscription',subscription);
router.get('/check',Check);
router.get('/adminsignup',adminSignup);
router.post('/adminlogin',adminLogin);
router.post('/validatetoken',validateToken);
router.post('/addposition',addPosition);
router.get('/getposition', getPosition);
router.delete('/deleteposition/:id',deletePosition);
router.put('/updateposition/:id',updatePosition);

export default router;