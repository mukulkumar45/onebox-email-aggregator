import { pipeline } from '@xenova/transformers';

// Cache for the classifier to avoid reloading
let classifier: any = null;

// Type for our email categories
export type EmailCategory = 
  | 'important' 
  | 'spam' 
  | 'job' 
  | 'promotions' 
  | 'social' 
  | 'updates' 
  | 'forums' 
  | 'uncategorized';

// Initialize the classifier (lazy loading)
async function initializeClassifier() {
  if (!classifier) {
    classifier = await pipeline(
      'text-classification',
      'Xenova/distilbert-base-uncased-emotion' // Pre-trained model
    );
  }
  return classifier;
}

// Custom rules for specific categories
function applyCustomRules(text: string): EmailCategory | null {
  const lowerText = text.toLowerCase();
  
  // Job-related keywords
  const jobKeywords = ['hiring', 'job', 'career', 'recruit', 'position', 'application'];
  if (jobKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'job';
  }
  
  // Spam indicators
  const spamKeywords = ['win', 'prize', 'free', 'offer', 'limited time', 'click here'];
  if (spamKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'spam';
  }
  
  return null;
}

// Main categorization function
export async function categorizeEmail(subject: string, body: string): Promise<EmailCategory> {
  try {
    const combinedText = `${subject} ${body}`.substring(0, 500); // Limit text length
    console.log('Categorizing email with text:', combinedText);

    // 1. Check custom rules first
    const ruleBasedCategory = applyCustomRules(combinedText);
    if (ruleBasedCategory) {
      console.log('Rule-based category:', ruleBasedCategory);
      return ruleBasedCategory;
    }

    // 2. Use AI model
    const classifier = await initializeClassifier();
    const result = await classifier(combinedText, { topk: 1 });
    console.log('Model classification result:', result);

    const label = result[0].label.toLowerCase();
    const finalCategory = mapLabelToCategory(label);
    console.log('Final category:', finalCategory);
    
    return finalCategory;
  } catch (error) {
    console.error('Categorization error:', error);
    return 'uncategorized';
  }
}

function mapLabelToCategory(label: string): EmailCategory {
  if (label.includes('important')) return 'important';
  if (label.includes('spam')) return 'spam';
  if (label.includes('job') || label.includes('career')) return 'job';
  if (label.includes('promotion')) return 'promotions';
  if (label.includes('social')) return 'social';
  if (label.includes('update')) return 'updates';
  if (label.includes('forum')) return 'forums';
  return 'uncategorized';
}