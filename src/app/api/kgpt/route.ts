// src/app/api/kgpt/route.ts
import { type NextRequest } from 'next/server';

const EXTERNAL_KGPT_API_URL = 'https://kgpt-1.onrender.com/query';

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

    // Read the response body as text first to handle both JSON and non-JSON responses gracefully
    const responseBodyText = await externalApiResponse.text();
    let responseData;

    try {
      // Attempt to parse the text as JSON
      responseData = JSON.parse(responseBodyText);
    } catch (e) {
      // If JSON.parse fails, responseData will remain undefined.
      // This is expected if the error response from the external API is not JSON.
    }

    if (!externalApiResponse.ok) {
      let errorDetail = `External API error: ${externalApiResponse.status}`;
      // Use parsed JSON error if available and has known fields (like 'detail' or 'error')
      if (responseData && responseData.detail) {
        errorDetail = responseData.detail;
      } else if (responseData && responseData.error) {
        errorDetail = responseData.error;
      } else if (responseBodyText) { // Fallback to the raw text if no specific JSON error field found or if not JSON
        errorDetail = responseBodyText;
      }
      
      console.error(`Error from ${EXTERNAL_KGPT_API_URL} [${externalApiResponse.status}]: ${errorDetail}`);
      // Return a JSON response with an 'error' field, as the client-side component expects this structure
      return Response.json({ error: errorDetail }, { status: externalApiResponse.status });
    }

    // If externalApiResponse.ok is true, we expect valid JSON.
    // responseData should hold the parsed JSON if successful.
    if (!responseData) {
      console.error(`Error from ${EXTERNAL_KGPT_API_URL}: Successful response but not valid JSON. Body: ${responseBodyText}`);
      return Response.json({ error: "External API returned a successful but non-JSON or malformed JSON response." }, { status: 502 }); // 502 Bad Gateway
    }
    
    // Forward the successful JSON data from the external API
    return Response.json(responseData, { status: 200 });

  } catch (error: any) {
    console.error('Error in /api/kgpt proxy:', error);
    // For internal errors in the proxy, return a generic error message
    const message = 'Internal Server Error while proxying to KGPT API.';
    return Response.json({ error: message }, { status: 500 });
  }
}
