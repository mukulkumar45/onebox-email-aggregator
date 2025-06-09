import { ParsedMail } from 'mailparser';
import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

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

export async function indexEmail(user: string, parsedEmail: ParsedMail, category?: string) {
  const emailData = {
    from: parsedEmail.from?.text || '',
    subject: parsedEmail.subject || '',
    date: parsedEmail.date || new Date().toISOString(),
    text: parsedEmail.text || '',
    html: parsedEmail.html || '',
    user,
    category: category || '', 
    status: 'new',
  };


  try {
    await client.index({
      index: 'emails',
      document: emailData,
    });
    console.log(`✅ Successfully indexed email with category: ${emailData.category}`);
  } catch (error) {
    console.error('Error indexing email:', error);
  }
}
