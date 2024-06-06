//require('dotenv').config();
// const express = require('express');
// const nodemailer = require('nodemailer');
// const bodyParser = require("body-parser");
// const cors = require("cors");

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from './apiRoutes.js'

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    mode: "no-cors",
    origin: ["http://34.93.162.58:3000/"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use('/backend', router);

const PORT = 4000;
app.listen(PORT, () => 
{
    console.log(`Server is running on port ${PORT}`);
})