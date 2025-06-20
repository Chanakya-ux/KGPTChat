
// src/ai/flows/generate-follow-up-questions.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating follow-up questions to a user's query.
 *
 * The flow takes the user's question and the AI's answer as input, and returns a list of suggested follow-up questions.
 *
 * @interface GenerateFollowUpQuestionsInput - The input type for the generateFollowUpQuestions function.
 * @interface GenerateFollowUpQuestionsOutput - The output type for the generateFollowUpQuestions function.
 * @function generateFollowUpQuestions - The main function that triggers the follow-up question generation flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFollowUpQuestionsInputSchema = z.object({
  question: z.string().describe('The user question.'),
  answer: z.string().describe('The AI answer to the question.'),
});
export type GenerateFollowUpQuestionsInput = z.infer<typeof GenerateFollowUpQuestionsInputSchema>;

const GenerateFollowUpQuestionsOutputSchema = z.object({
  followUpQuestions: z.array(
    z.string().describe('A suggested follow-up question.')
  ).describe('An array of suggested follow-up questions based on the answer.')
});
export type GenerateFollowUpQuestionsOutput = z.infer<typeof GenerateFollowUpQuestionsOutputSchema>;

export async function generateFollowUpQuestions(input: GenerateFollowUpQuestionsInput): Promise<GenerateFollowUpQuestionsOutput> {
  return generateFollowUpQuestionsFlow(input);
}

const generateFollowUpQuestionsPrompt = ai.definePrompt({
  name: 'generateFollowUpQuestionsPrompt',
  input: {
    schema: GenerateFollowUpQuestionsInputSchema,
  },
  output: {
    schema: GenerateFollowUpQuestionsOutputSchema,
  },
  prompt: `Given the following question and answer, suggest two follow-up questions that the user might ask to explore the topic more deeply.\n\nQuestion: {{{question}}}\nAnswer: {{{answer}}}\n\nFollow-up Questions:`,
});

const generateFollowUpQuestionsFlow = ai.defineFlow(
  {
    name: 'generateFollowUpQuestionsFlow',
    inputSchema: GenerateFollowUpQuestionsInputSchema,
    outputSchema: GenerateFollowUpQuestionsOutputSchema,
  },
  async input => {
    const {output} = await generateFollowUpQuestionsPrompt(input);
    return output!;
  }
);

