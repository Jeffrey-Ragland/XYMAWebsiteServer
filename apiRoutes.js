import express from 'express';
import multer from "multer";
import { contacts, subscription ,Check, adminSignup, adminLogin, validateToken, addPosition, getPosition, deletePosition, updatePosition, uploadApplicationForm} from './index.js';

const router = express.Router();

//for resume
const storage = multer.memoryStorage();
const upload = multer({ storage: storage})

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
router.post('/uploadapplicationform', upload.single('file'), uploadApplicationForm);

export default router;