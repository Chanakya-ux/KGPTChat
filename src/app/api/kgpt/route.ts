
// src/app/api/kgpt/route.ts
import type { NextRequest } from 'next/server';

// Read the external API URL from environment variable, with a fallback
const EXTERNAL_KGPT_API_URL = process.env.EXTERNAL_KGPT_API_URL || 'https://kgpt-1.onrender.com/query';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question } = body;

    if (!question || typeof question !== 'string') {
      return Response.json({ error: 'Question is required and must be a string' }, { status: 400 });
    }

    const externalApiResponse = await fetch(EXTERNAL_KGPT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    const responseBodyText = await externalApiResponse.text();
    let responseData;

    try {
      responseData = JSON.parse(responseBodyText);
    } catch (e) {
      // JSON parsing failed
    }

    if (!externalApiResponse.ok) {
      let errorDetail = `External API error: ${externalApiResponse.status}`;
      if (responseData && responseData.detail) {
        errorDetail = responseData.detail;
      } else if (responseData && responseData.error) {
        errorDetail = responseData.error;
      } else if (responseBodyText) {
        errorDetail = responseBodyText;
      }
      console.error(`Error from ${EXTERNAL_KGPT_API_URL} [${externalApiResponse.status}]: ${errorDetail}`);
      return Response.json({ error: errorDetail }, { status: externalApiResponse.status });
    }

    if (!responseData) {
      console.error(`Error from ${EXTERNAL_KGPT_API_URL}: Successful response but not valid JSON. Body: ${responseBodyText}`);
      return Response.json({ error: "External API returned a successful but non-JSON or malformed JSON response." }, { status: 502 });
    }
    
    return Response.json(responseData, { status: 200 });

  } catch (error: any) {
    console.error('Error in /api/kgpt proxy:', error);
    const message = 'Internal Server Error while proxying to KGPT API.';
    return Response.json({ error: message }, { status: 500 });
  }
}
