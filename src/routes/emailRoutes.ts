import express from 'express';
import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
import { categorizeEmail } from '../utils/emailCategorizer';

const router = express.Router();
dotenv.config();

const client = new Client({
  cloud: {
    id: process.env.ELASTIC_CLOUD_ID!,  
  },
  auth: {
    username: process.env.ELASTIC_USER!,
    password: process.env.ELASTIC_PASS!,
  },
});

router.get('/emails', async (req, res) => {
  try {
    const { hits } = await client.search({
      index: 'emails', 
      query: {
        match_all: {},
      },
      size: 50,
      _source: ['from', 'subject', 'date', 'text', 'category'] // Explicitly include fields
    });

    const emails = hits.hits.map((hit: any) => ({
      id: hit._id,
      ...hit._source,
      category: hit._source.category || 'uncategorized' // Ensure category exists
    }));

    res.json(emails);
  } catch (error) {
    console.error('Error fetching emails from Elasticsearch:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});



export default router;
