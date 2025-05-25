"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexEmail = indexEmail;
const elasticsearchClient_1 = require("./elasticsearchClient");
async function indexEmail(accountUser, mail) {
    try {
        const result = await elasticsearchClient_1.esClient.index({
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
    }
    catch (error) {
        console.error('❌ Error indexing email:', error);
    }
}
