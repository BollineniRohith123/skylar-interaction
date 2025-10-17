import { NextResponse, NextRequest } from 'next/server';
import { CallConfig } from '@/lib/types';

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
      throw new Error(`Ultravox API error: ${response.status}, ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Error calling Ultravox API', details: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred.' },
        { status: 500 }
      );
    }
  }
}