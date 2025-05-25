import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

export const esClient = new Client({
  node: process.env.ELASTIC_NODE, 
  auth: {
    username: process.env.ELASTIC_USER!,
    password: process.env.ELASTIC_PASS!,
  },
});
