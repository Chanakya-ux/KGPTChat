
"use server";

import type { Message } from "@/types";
import { generateFollowUpQuestions, type GenerateFollowUpQuestionsInput } from "@/ai/flows/generate-follow-up-questions";

const EXTERNAL_KGPT_API_URL = process.env.EXTERNAL_KGPT_API_URL || 'https://kgpt-1.onrender.com/query';

interface ChatResponse {
  answer: string;
  suggestions: string[];
  error?: string;
}

export async function submitUserMessage(question: string): Promise<ChatResponse> {
  let answer = "";
  let suggestions: string[] = [];
  let error: string | undefined;

  try {
    const response = await fetch(EXTERNAL_KGPT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        // If response is not JSON, use generic error
      }
      const apiError = errorData?.error || `API request failed with status ${response.status}`;
      console.error(`Error from ${EXTERNAL_KGPT_API_URL}: ${apiError}`);
      return { answer: "", suggestions: [], error: apiError };
    }

    const data = await response.json();
    answer = data.answer || "Sorry, I couldn't get a valid response from KGPT.";

    if (answer && !answer.startsWith("Sorry")) {
      try {
        const followUpInput: GenerateFollowUpQuestionsInput = { question, answer };
        const followUpOutput = await generateFollowUpQuestions(followUpInput);
        suggestions = followUpOutput.followUpQuestions.slice(0, 3);
      } catch (genkitError) {
        console.error("Error generating follow-up questions:", genkitError);
        // Non-fatal, so we still return the answer
      }
    }
  } catch (e: any) {
    console.error('Error in submitUserMessage action:', e);
    error = e.message || "An unexpected error occurred.";
    answer = "There was an issue connecting to the AI. Please try again.";
  }

  return { answer, suggestions, error };
}
