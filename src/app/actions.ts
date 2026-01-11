'use server';

import { answerPerfumeQuestion } from "@/ai/flows/answer-perfume-questions";
import { handleOutOfDomainQuery } from "@/ai/flows/handle-out-of-domain-queries";
import { logUserQuery } from "@/ai/flows/log-user-queries";
import { getKnowledgeBaseAsString } from "@/services/firebase/store";

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export async function askAI(history: ChatMessage[], message: string): Promise<string> {
  const query = message;
  const timestamp = Date.now();

  // Log query first
  await logUserQuery({ query, timestamp });

  // Check if query is out of domain
  const oodResult = await handleOutOfDomainQuery({ query });
  if (oodResult.isOutOfDomain && oodResult.response) {
    return oodResult.response;
  }

  // If in domain, get knowledge base and ask the main AI
  const knowledgeBase = await getKnowledgeBaseAsString();

  const aiResult = await answerPerfumeQuestion({
    query,
    firebaseData: knowledgeBase,
    userRole: 'USER',
  });
  
  return aiResult.answer;
}
