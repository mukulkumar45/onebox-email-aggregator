"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const elasticsearch_1 = require("@elastic/elasticsearch");
const dotenv_1 = __importDefault(require("dotenv"));
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
            size: 1500,
        });
        const emails = hits.hits.map((hit) => ({
            id: hit._id,
            ...hit._source,
        }));
        res.json(emails);
    }
    catch (error) {
        console.error('Error fetching emails from Elasticsearch:', error);
        res.status(500).json({ error: 'Failed to fetch emails' });
    }
});
exports.default = router;
