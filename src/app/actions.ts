'use server';

import { answerPerfumeQuestion } from "@/ai/flows/answer-perfume-questions";
import { handleOutOfDomainQuery } from "@/ai/flows/handle-out-of-domain-openrouter";
import { logUserQuery } from "@/ai/flows/log-user-queries";
import { getKnowledgeBaseAsString } from "@/services/mysql/store";
import { callOpenRouter } from "@/ai/openrouter";

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// OpenRouter calls are handled by `src/ai/openrouter.ts`

export async function askAI(history: ChatMessage[], message: string, language: 'en' | 'ms' = 'en'): Promise<string> {
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

  try {
    // Try OpenRouter first
    try {
      const langName = language === 'ms' ? 'Malay' : 'English';
      const systemPrompt = `You are a luxury perfume concierge for FGPerfume, a Malaysian brand focused on affordable luxury. Answer user questions about the brand and its perfumes using only the provided data. You MUST respond in ${langName}.

    IMPORTANT: The knowledge base includes a canonical 'Data (JSON)' block at the end. That JSON is the authoritative source for brand, contact, and perfume listings. For any factual question (including listing perfumes or availability), you MUST use only the Data (JSON) block and must NOT invent or add any perfumes or attributes not present in that JSON. If the requested factual information is not present there, respond with: "I’m sorry, I don’t have information about that yet." (use the requested language).

    Follow these rules:
    - Answer ONLY questions related to FGPerfume brand or its perfumes.
    - Use ONLY the data provided in the knowledge base.
    - Never access general knowledge outside the provided data.
    - Never guess or hallucinate information.
    - Never answer questions about other brands, companies, people, or topics.

    If a user asks a question that is unrelated to FGPerfume or outside the provided data, respond with:
    "FGPerfume AI is dedicated exclusively to FGPerfume and its creations. I'm unable to assist with that request."

    Your personality: Luxury perfume concierge, elegant & sophisticated, confident & knowledgeable, calm & professional.

    Knowledge Base:
    ${knowledgeBase}

    User Question: ${query}`;

      const answer = await callOpenRouter(systemPrompt);
      return answer;
    } catch (openRouterError) {
      console.warn('OpenRouter failed, falling back to Genkit:', openRouterError);
      
      // Fallback to Genkit with Gemini
      const mappedLang = language === 'ms' ? 'Malay' : 'English';
      const aiResult = await answerPerfumeQuestion({
        query,
        firebaseData: knowledgeBase,
        userRole: 'USER',
        language: mappedLang,
      });
      
      return aiResult.answer;
    }
  } catch (error) {
    // Final fallback response if everything fails
    console.error('AI Error:', error);
    return "I apologize, but I encountered an error processing your request. Please try again.";
  }
}
