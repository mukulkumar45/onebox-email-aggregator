import express from 'express';
import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
import { categorizeEmail } from '../utils/emailCategorizer';
import axios from 'axios';

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
      _source: ['from', 'subject', 'date', 'text', 'category'] 
    });

    const emails = hits.hits.map((hit: any) => ({
      id: hit._id,
      ...hit._source,
      category: hit._source.category || 'uncategorized' 
    }));

    res.json(emails);
  } catch (error) {
    console.error('Error fetching emails from Elasticsearch:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HUGGINGFACE_SUMMARY_MODEL_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';

router.post('/emails/suggest-reply', async (req, res) => {
  const { subject, text } = req.body;

  try {
    const prompt = `Subject: ${subject}\n\nEmail: ${text}`;

    const response = await axios.post(
      HUGGINGFACE_SUMMARY_MODEL_URL,
      {
        inputs: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const summary = response.data?.[0]?.summary_text || 'Thank you for your email. I will get back to you soon.';

    res.json({ reply: summary });
  } catch (error) {
    console.error('AI reply generation failed:', error);
    res.status(500).json({ error: 'Failed to generate AI reply' });
  }
});




export default router;
