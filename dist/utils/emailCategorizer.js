"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeClassifier = initializeClassifier;
exports.categorizeEmail = categorizeEmail;
const transformers_1 = require("@xenova/transformers");
transformers_1.env.allowLocalModels = true;
transformers_1.env.localModelPath = './.transformers_cache';
async function initializeClassifier() {
    console.log('Initializing classifier...');
    try {
        if (!classifier) {
            console.log('Downloading model... (first time only)');
            classifier = await (0, transformers_1.pipeline)('text-classification', 'Xenova/distilbert-base-uncased-emotion', {
                quantized: true,
                progress_callback: (progress) => {
                    console.log(`Download progress: ${Math.round(progress.progress * 100)}%`);
                }
            });
            console.log('Model loaded successfully!');
        }
        return classifier;
    }
    catch (error) {
        console.error('Model initialization failed:', error);
        throw error;
    }
}
let classifier = null;
// export async function initializeClassifier() {
//   if (!classifier) {
//     classifier = await pipeline(
//       'text-classification',
//       'Xenova/distilbert-base-uncased-emotion',
//       {
//         quantized: true, // Use smaller model
//         progress_callback: (data: any) => {
//           console.log(`Download progress: ${Math.round(data.progress * 100)}%`);
//         }
//       }
//     );
//   }
//   return classifier;
// }
async function categorizeEmail(subject, body) {
    try {
        await initializeClassifier();
        const text = `${subject} ${body}`.substring(0, 1000); // Limit input size
        const result = await classifier(text, { topk: 1 });
        return mapToCategory(result[0].label);
    }
    catch (error) {
        console.error('AI Classification failed:', error);
        return basicCategorization(subject, body); // Fallback
    }
}
function mapToCategory(label) {
    const lowerLabel = label.toLowerCase();
    if (/important|urgent/.test(lowerLabel))
        return 'important';
    if (/spam|scam/.test(lowerLabel))
        return 'spam';
    if (/job|career|hiring/.test(lowerLabel))
        return 'job';
    if (/promo|sale|discount/.test(lowerLabel))
        return 'promotions';
    return 'uncategorized';
}
function basicCategorization(subject, body) {
    const text = `${subject} ${body}`.toLowerCase();
    if (/job|hiring|career/.test(text))
        return 'job';
    if (/urgent|important/.test(text))
        return 'important';
    if (/sale|discount|promo/.test(text))
        return 'promotions';
    return 'uncategorized';
}
