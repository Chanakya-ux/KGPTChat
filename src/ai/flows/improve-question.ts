'use server';

/**
 * @fileOverview Rewrites a user's question to be more effective.
 *
 * - improveQuestion - A function that takes a user's question and returns a rewritten version.
 * - ImproveQuestionInput - The input type for the improveQuestion function.
 * - ImproveQuestionOutput - The return type for the improveQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveQuestionInputSchema = z.object({
  question: z.string().describe('The user question to be rewritten.'),
});
export type ImproveQuestionInput = z.infer<typeof ImproveQuestionInputSchema>;

const ImproveQuestionOutputSchema = z.object({
  rewrittenQuestion: z.string().describe('The rewritten question.'),
});
export type ImproveQuestionOutput = z.infer<typeof ImproveQuestionOutputSchema>;

export async function improveQuestion(input: ImproveQuestionInput): Promise<ImproveQuestionOutput> {
  return improveQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveQuestionPrompt',
  input: {schema: ImproveQuestionInputSchema},
  output: {schema: ImproveQuestionOutputSchema},
  prompt: `Rewrite the following question to be more effective. The goal is to get a better answer from an AI assistant.  Make sure the rewritten question is still asking the same thing as the original question.

Original question: {{{question}}}`,
});

const improveQuestionFlow = ai.defineFlow(
  {
    name: 'improveQuestionFlow',
    inputSchema: ImproveQuestionInputSchema,
    outputSchema: ImproveQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
