import fetch from 'node-fetch';

export interface OpenRouterOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export async function callOpenRouter(prompt: string, opts?: OpenRouterOptions): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set');

  const model = opts?.model ?? 'nousresearch/hermes-3-llama-3.1-405b:free';
  const temperature = opts?.temperature ?? 0.7;
  const max_tokens = opts?.max_tokens ?? 1000;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature,
      max_tokens,
    }),
  });

  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`OpenRouter returned non-JSON response: ${text}`);
  }

  if (!res.ok) {
    const err = data || { status: res.status, text };
    throw new Error(`OpenRouter API Error: ${JSON.stringify(err)}`);
  }

  // defensively get message content
  const choice = data.choices && data.choices[0];
  const message = choice?.message?.content ?? choice?.text ?? JSON.stringify(data);
  return message;
}
