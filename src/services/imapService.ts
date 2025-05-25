import { ImapFlow, ImapFlowOptions } from 'imapflow';
import { simpleParser } from 'mailparser';
import dotenv from 'dotenv';
import { indexEmail } from '../../src/indexEmail'; 

dotenv.config();

const imapAccounts = [
  {
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER1!,
      pass: process.env.EMAIL_PASS1!,
    },
  },
  {
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER2!,
      pass: process.env.EMAIL_PASS2!,
    },
  },
];

async function startIdle(client: ImapFlow, accountUser: string) {
  while (true) {
    try {
      await client.idle();

      const lock = await client.getMailboxLock('INBOX');
      try {
        const latest = await client.fetchOne('*', { uid: true, envelope: true, source: true });
        if (latest) {
          const parsed = await simpleParser(latest.source as Buffer);
          console.log(`🆕 [${accountUser}] ${parsed.subject}`);
          await indexEmail(accountUser, parsed); 
        }
      } finally {
        lock.release();
      }
    } catch (err) {
      console.error(`Error in IDLE for ${accountUser}:`, err);
    }
  }
}

export async function startIMAPSync() {
  for (const account of imapAccounts) {
    const client = new ImapFlow(account as ImapFlowOptions);

    client.on('error', (err) => {
      console.error(`IMAP Error (${account.auth.user}):`, err);
    });

    await client.connect();
    await client.mailboxOpen('INBOX');

    console.log(`Connected to ${account.auth.user}, fetching emails...`);

    const since = new Date();
    since.setDate(since.getDate() - 30);

    for await (const msg of client.fetch({ since }, { uid: true, envelope: true, source: true })) {
      const parsed = await simpleParser(msg.source as Buffer);
      console.log(`📩 [${account.auth.user}] ${parsed.subject}`);
      await indexEmail(account.auth.user, parsed); 
    }

    console.log(`🔄 Starting real-time IDLE mode for ${account.auth.user}`);
    startIdle(client, account.auth.user);
  }
}
