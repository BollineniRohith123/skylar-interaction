import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    const response = await fetch('https://api.ultravox.ai/api/accounts/me', {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Invalid API key or API error', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Convert seconds to minutes for better display
    const freeTimeRemainingMinutes = Math.round((parseFloat(data.freeTimeRemaining) || 0) / 60);
    const freeTimeUsedMinutes = Math.round((parseFloat(data.freeTimeUsed) || 0) / 60);

    return NextResponse.json({
      freeTimeRemaining: freeTimeRemainingMinutes,
      freeTimeUsed: freeTimeUsedMinutes,
      hasActiveSubscription: data.hasActiveSubscription,
      subscriptionTier: data.subscriptionTier,
      allowedConcurrentCalls: data.allowedConcurrentCalls,
      allowedVoices: data.allowedVoices
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Error checking usage', details: error.message },
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
