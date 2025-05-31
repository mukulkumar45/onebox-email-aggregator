// utils/emailCategorizer.ts
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

const candidateLabels = ['Job', 'Newsletter', 'Promotion', 'Personal', 'Spam'];

export const categorizeEmail = async (subject: string, body: string): Promise<string> => {
  try {
    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: `Subject: ${subject}\n\nBody: ${body}`,
        parameters: {
          candidate_labels: candidateLabels
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const labels = response.data.labels;
    const scores = response.data.scores;
    console.log(labels[0]);
    return "job";
  } catch (error) {
    console.error('❌ Categorization failed:', error);
    return 'Uncategorized';
  }
};
