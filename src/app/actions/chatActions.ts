
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
      // Consider adding a timeout if your Node version supports AbortSignal.timeout easily
      // signal: AbortSignal.timeout(15000) // e.g., 15 seconds
    });

    if (!response.ok) {
      let apiError = `API request failed with status ${response.status}`; // Default message
      try {
        const errorText = await response.text();
        console.warn(`KGPT API error response (status ${response.status}). Body: ${errorText.substring(0, 500)}`);
        try {
          const errorData = JSON.parse(errorText);
          if (errorData && typeof errorData.error === 'string') {
            apiError = errorData.error;
          } else if (errorData && typeof errorData.detail === 'string') { // Some APIs use "detail" for errors
            apiError = errorData.detail;
          }
        } catch (jsonParseError) {
          // Response body was not JSON.
          // Use the raw text if it's short, not HTML, and seems like a useful message.
          if (errorText && errorText.trim().length > 0 && errorText.trim().length < 250 && !errorText.trim().toLowerCase().startsWith('<!doctype html') && !errorText.trim().toLowerCase().startsWith('<html')) {
            apiError = errorText.trim();
          }
        }
      } catch (textParseError) {
        console.error(`Failed to get/parse text from API error response (status ${response.status})`, textParseError);
        // Stick with the default status code message if text parsing fails.
      }
      console.error(`Error from ${EXTERNAL_KGPT_API_URL}: ${apiError}`);
      return { answer: "", suggestions: [], error: apiError };
    }

    // Response is OK (status 2xx), try to parse JSON
    const responseText = await response.text();
    try {
        const data = JSON.parse(responseText);
        answer = data.answer || "Sorry, I couldn't get a valid response from KGPT.";

        // Generate follow-up questions only if we got a meaningful answer
        if (answer && !answer.startsWith("Sorry")) {
          try {
            const followUpInput: GenerateFollowUpQuestionsInput = { question, answer };
            const followUpOutput = await generateFollowUpQuestions(followUpInput);
            suggestions = followUpOutput.followUpQuestions.slice(0, 3);
          } catch (genkitError) {
            console.error("Error generating follow-up questions:", genkitError);
            // This is non-fatal for suggestions; we still have the main answer.
            // Suggestions will remain empty or as initialized.
          }
        }
    } catch (jsonParseError: any) {
        console.error('Failed to parse KGPT API success response as JSON. Body snippet:', responseText.substring(0,500), jsonParseError);
        // This means the API said "OK" but sent malformed JSON.
        error = "The AI service's response was successful but not in the expected format.";
        answer = "Sorry, I received an unreadable response from the AI. Please try again.";
        return { answer, suggestions, error }; // Ensure error is part of the returned object
    }

  } catch (e: any) {
    console.error('Network or unexpected error in submitUserMessage action:', e);
    // This catches fetch operational errors (network down, DNS issues, etc.)
    // or errors from AbortSignal if used.
    if (e.name === 'AbortError') {
        answer = "The request to the AI service timed out. Please try again."
        error = "Request to AI service timed out.";
    } else {
        answer = "There was an issue connecting to the AI. Please check your network and try again.";
        error = e.message || "An unexpected network or system error occurred.";
    }
  }

  // Ensure 'error' is explicitly part of the return, even if undefined.
  return { answer, suggestions, error };
}

