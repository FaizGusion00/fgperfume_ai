import { config } from 'dotenv';
config();

import '@/ai/flows/handle-out-of-domain-queries.ts';
import '@/ai/flows/log-user-queries.ts';
import '@/ai/flows/answer-perfume-questions.ts';