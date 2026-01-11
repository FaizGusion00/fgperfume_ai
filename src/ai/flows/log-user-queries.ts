'use server';

/**
 * @fileOverview Logs user queries for review by the admin.
 *
 * - logUserQuery - A function that logs user queries to a database.
 * - LogUserQueryInput - The input type for the logUserQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { saveUserQuery } from '@/services/mysql/store';

const LogUserQueryInputSchema = z.object({
  query: z.string().describe('The user query to log.'),
  timestamp: z.number().describe('The timestamp of the query.'),
});
export type LogUserQueryInput = z.infer<typeof LogUserQueryInputSchema>;

export async function logUserQuery(input: LogUserQueryInput): Promise<void> {
  return logUserQueryFlow(input);
}

const logUserQueryFlow = ai.defineFlow(
  {
    name: 'logUserQueryFlow',
    inputSchema: LogUserQueryInputSchema,
    outputSchema: z.void(),
  },
  async input => {
    await saveUserQuery(input.query, input.timestamp);
  }
);
