import express, { Request, Response } from 'express';
import { Client } from '@elastic/elasticsearch';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const client = new Client({
  cloud: {
    id: process.env.ELASTIC_CLOUD_ID!,
  },
  auth: {
    username: process.env.ELASTIC_USER!,
    password: process.env.ELASTIC_PASS!,
  },
});



export default router;
