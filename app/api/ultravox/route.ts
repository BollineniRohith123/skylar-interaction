import { NextResponse, NextRequest } from 'next/server';
import { CallConfig } from '@/lib/types';

function sanitizeServerError(message: unknown) {
  try {
    const str = typeof message === 'string' ? message : JSON.stringify(message);
    return str.replace(/ultravox/gi, 'skylar');
  } catch (e) {
    return 'Error contacting Skylar API';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CallConfig = await request.json();
    
    const response = await fetch('https://api.ultravox.ai/api/calls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': body.apiKey || `${process.env.ULTRAVOX_API_KEY}`,
      },
      body: JSON.stringify({
        systemPrompt: body.systemPrompt,
        model: body.model,
        languageHint: body.languageHint,
        selectedTools: body.selectedTools,
        voice: body.voice,
        temperature: body.temperature,
        maxDuration: body.maxDuration,
        timeExceededMessage: body.timeExceededMessage,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Throw a sanitized error so client does not see provider keywords
      const sanitized = sanitizeServerError(errorText);
      throw new Error(`Skylar API error: ${response.status}, ${sanitized}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Error calling Skylar API', details: sanitizeServerError(error.message) },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred while contacting the Skylar API.' },
        { status: 500 }
      );
    }
  }
}