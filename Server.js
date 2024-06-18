import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import router from './apiRoutes.js'

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    mode: "no-cors",
    origin: ["http://34.93.162.58:3000"], 
    // origin: ['http://localhost:3000'],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

mongoose.connect('mongodb://127.0.0.1:27017/website');

app.use('/backend', router);

const PORT = 4000;
app.listen(PORT, () => 
{
    console.log(`Server is running on port ${PORT}`);
})