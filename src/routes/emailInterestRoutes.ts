import express, { Request, Response, Router } from 'express';

import { Client } from '@elastic/elasticsearch';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const client = new Client({
  cloud: {
    id: process.env.ELASTIC_CLOUD_ID!,
  },
  auth: {
    username: process.env.ELASTIC_USER!,
    password: process.env.ELASTIC_PASS!,
  },
});

router.put('/emails/:id/interest', async (req: Request, res: Response): Promise<void> => {
  const emailId = req.params.id;

  try {
    await client.update({
      index: 'emails',
      id: emailId,
      doc: {
        status: 'Interested',
      },
    });

    const emailDoc = await client.get({
      index: 'emails',
      id: emailId,
    });

    interface EmailDoc {
      subject?: string;
      from?: string;
      date?: string | number | Date;
      [key: string]: any;
    }

    const email = emailDoc._source as EmailDoc;

    if (!email) {
      res.status(404).json({ error: 'Email not found after update' });
      return;
    }

    if (process.env.SLACK_WEBHOOK_URL) {
      await axios.post(process.env.SLACK_WEBHOOK_URL, {
        text: `📧 New Interested Email!\n*Subject:* ${email.subject || '(No Subject)'}\n*From:* ${email.from || 'Unknown'}\n*Date:* ${email.date ? new Date(email.date).toLocaleString() : 'Unknown'}`,
      });
    }

    if (process.env.WEBHOOK_URL) {
      await axios.post(process.env.WEBHOOK_URL, {
        event: 'InterestedEmail',
        email,
      });
    }

    res.json({ message: 'Email marked as Interested and notifications sent.' });
  } catch (error) {
    console.error('❌ Error updating email interest status:', error);
    res.status(500).json({ error: 'Failed to update email status' });
  }
});

export default router;
