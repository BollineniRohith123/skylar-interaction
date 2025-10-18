'use client';
import { UltravoxSession, UltravoxSessionStatus, Transcript, UltravoxExperimentalMessageEvent, Role } from 'ultravox-client';
import { JoinUrlResponse, CallConfig } from '@/lib/types';
import { updateOrderTool, showImageTool, createCampaignStrategyTool, endCallTool } from './clientTools';

let uvSession: UltravoxSession | null = null;
const debugMessages: Set<string> = new Set(["debug"]);

interface CallCallbacks {
  onStatusChange: (status: UltravoxSessionStatus | string | undefined) => void;
  onTranscriptChange: (transcripts: Transcript[] | undefined) => void;
  onDebugMessage?: (message: UltravoxExperimentalMessageEvent ) => void;
}

// Utility to redact any mention of the vendor name from logs/errors
function redactUltravox(input: any) {
  try {
    if (input === undefined || input === null) return input;
    if (input instanceof Error) {
      const msg = input.message || String(input);
      return new Error(msg.replace(/ultravox/gi, 'skylar'));
    }
    const str = typeof input === 'string' ? input : JSON.stringify(input);
    return str.replace(/ultravox/gi, 'skylar');
  } catch (e) {
    return '[redacted]';
  }
}

export function toggleMute(role: Role): void {

  if (uvSession) {
    // Toggle (user) Mic
    if (role == Role.USER) {
      uvSession.isMicMuted ? uvSession.unmuteMic() : uvSession.muteMic();
    } 
    // Mute (agent) Speaker
    else {
      uvSession.isSpeakerMuted ? uvSession.unmuteSpeaker() : uvSession.muteSpeaker();
    }
  } else {
    console.error('uvSession is not initialized.');
  }
}

async function createCall(callConfig: CallConfig, showDebugMessages?: boolean): Promise<JoinUrlResponse> {

  try {
    if(showDebugMessages) {
      // Avoid leaking provider/model names in console
      console.log(`Using model ${redactUltravox(callConfig.model)}`);
    }

    const response = await fetch(`/api/ultravox`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...callConfig }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const sanitized = redactUltravox(errorText);
      // Throw sanitized error to avoid exposing provider keywords in the client
      throw new Error(`HTTP error! status: ${response.status}, message: ${sanitized}`);
    }
    const data: JoinUrlResponse = await response.json();

    if(showDebugMessages) {
      // Redact host portion of join URL so vendor hostname does not appear
      const redactedJoin = data.joinUrl ? String(data.joinUrl).replace(/:\/\/[^/]+/, '://[redacted]') : '[redacted]';
      console.log(`Call created. Join URL: ${redactedJoin}`);
    }
    
    return data;
  } catch (error) {
    // Log sanitized error to console
    const safeErr = error instanceof Error ? redactUltravox(error) : redactUltravox(String(error));
    console.error('Error creating call:', safeErr);
    throw error;
  }
}

export async function startCall(callbacks: CallCallbacks, callConfig: CallConfig, showDebugMessages?: boolean): Promise<void> {
  const callData = await createCall(callConfig, showDebugMessages);
  const joinUrl = callData.joinUrl;

  if (!joinUrl && !uvSession) {
    console.error('Join URL is required');
    return;
  } else {
    // Don't print raw join URL (it may include vendor hostnames). Print a redacted URL instead.
    const redactedJoinUrl = joinUrl ? String(joinUrl).replace(/:\/\/[^/]+/, '://[redacted]') : '[redacted]';
    console.log('Joining call:', redactedJoinUrl);

    // Start up our Ultravox Session
    uvSession = new UltravoxSession({ experimentalMessages: debugMessages });
    
    // Register our tool for showing images (Skylar)
    uvSession.registerToolImplementation(
      "showImage",
      showImageTool
    );

    // Register our tool for creating campaign strategies (Skylar)
    uvSession.registerToolImplementation(
      "createCampaignStrategy",
      createCampaignStrategyTool
    );

    // Register our tool for ending calls (Skylar)
    uvSession.registerToolImplementation(
      "endCall",
      endCallTool
    );

    if(showDebugMessages) {
      // Avoid printing the full uvSession object which can contain SDK names
      console.log('uvSession created');
      console.log('uvSession methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(uvSession)));
    }

    if (uvSession) {
      uvSession.addEventListener('status', (event: any) => {
        callbacks.onStatusChange(uvSession?.status);
      });
  
      uvSession.addEventListener('transcript', (event: any) => {
        callbacks.onTranscriptChange(uvSession?.transcripts);
      });
  
      uvSession.addEventListener('experimental_message', (msg: any) => {
        // Sanitize any incoming debug message bodies before forwarding to the UI debug handler
        try {
          if (msg && msg.message && msg.message.message) {
            msg.message.message = redactUltravox(msg.message.message);
          }
        } catch (e) {
          // ignore
        }
        callbacks?.onDebugMessage?.(msg);
      });

      uvSession.joinCall(joinUrl);
      console.log('Session status:', uvSession.status);
    } else {
      return;
    }
  }

  console.log('Call started!'); 
}

export async function endCall(): Promise<void> {
  console.log('Call ended.');

  if (uvSession) {
    uvSession.leaveCall();
    uvSession = null;
  }

  // Dispatch a Skylar-specific custom event when the call ends so that Skylar UI can clear state
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('skylar:callEnded');
    window.dispatchEvent(event);
  }

}