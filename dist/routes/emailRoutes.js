"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const elasticsearch_1 = require("@elastic/elasticsearch");
const dotenv_1 = __importDefault(require("dotenv"));
const emailCategorizer_1 = require("../utils/emailCategorizer");
const router = express_1.default.Router();
dotenv_1.default.config();
const client = new elasticsearch_1.Client({
    cloud: {
        id: process.env.ELASTIC_CLOUD_ID,
    },
    auth: {
        username: process.env.ELASTIC_USER,
        password: process.env.ELASTIC_PASS,
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
        const emails = hits.hits.map((hit) => ({
            id: hit._id,
            ...hit._source,
            category: hit._source.category || 'uncategorized' // Ensure category exists
        }));
        res.json(emails);
    }
    catch (error) {
        console.error('Error fetching emails from Elasticsearch:', error);
        res.status(500).json({ error: 'Failed to fetch emails' });
    }
});
router.get('/test-classify', async (req, res) => {
    try {
        const testSubject = "Urgent: Job Opportunity at Google";
        const testBody = "We're looking for a skilled developer...";
        console.log('Starting test classification...');
        const category = await (0, emailCategorizer_1.categorizeEmail)(testSubject, testBody);
        res.json({
            testSubject,
            testBody,
            category,
            status: 'Classification test complete'
        });
    }
    catch (error) {
        console.error('Test classification failed:', error);
        res.status(500).json({ error: 'Classification test failed' });
    }
});
exports.default = router;
