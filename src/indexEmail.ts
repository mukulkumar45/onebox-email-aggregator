import { ParsedMail } from 'mailparser';
import { esClient } from './elasticsearchClient';

export async function indexEmail(accountUser: string, mail: ParsedMail) {
  try {
    const result = await esClient.index({
      index: 'emails', 
      document: {
        account: accountUser,
        subject: mail.subject || '',
        from: mail.from?.text || '',
        date: mail.date || new Date(),
        text: mail.text || '',
        html: mail.html || '',
        messageId: mail.messageId || '',
      },
    });

    console.log(`📦 Indexed email from ${accountUser}: ${mail.subject}`);
  } catch (error) {
    console.error('❌ Error indexing email:', error);
  }
}
