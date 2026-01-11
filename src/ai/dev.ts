import { config } from 'dotenv';
config();

import '@/ai/flows/handle-out-of-domain-openrouter.ts';
import '@/ai/flows/log-user-queries.ts';
import '@/ai/flows/answer-perfume-questions.ts';