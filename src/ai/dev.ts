import { config } from 'dotenv';
config();

import '@/ai/flows/generate-follow-up-questions.ts';
import '@/ai/flows/improve-question.ts';
import '@/ai/flows/summarize-chat-history.ts';