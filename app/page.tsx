'use client';

import React, { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation'; 
import { startCall, endCall } from '@/lib/callFunctions'
import { CallConfig, SelectedTool } from '@/lib/types'
import demoConfig from './demo-config';
import { Role, Transcript, UltravoxExperimentalMessageEvent, UltravoxSessionStatus } from 'ultravox-client';
import CallStatus from './components/CallStatus';
import DebugMessages from '@/app/components/DebugMessages';
import MicToggleButton from './components/MicToggleButton';
import { PhoneOffIcon } from 'lucide-react';
import OrderDetails from './components/OrderDetails';
import DetailedCampaignView from './components/DetailedCampaignView';

type SearchParamsProps = {
  showMuteSpeakerButton: boolean;
  modelOverride: string | undefined;
  showDebugMessages: boolean;
  showUserTranscripts: boolean;
};

type SearchParamsHandlerProps = {
  children: (props: SearchParamsProps) => React.ReactNode;
};

function SearchParamsHandler({ children }: SearchParamsHandlerProps) {
  // Process query params to see if we want to change the behavior for showing speaker mute button or changing the model
  const searchParams = useSearchParams();
  const showMuteSpeakerButton = searchParams.get('showSpeakerMute') === 'true';
  const showDebugMessages = searchParams.get('showDebugMessages') === 'true';
  const showUserTranscripts = searchParams.get('showUserTranscripts') === 'true';
  let modelOverride: string | undefined;
  
  if (searchParams.get('model')) {
    modelOverride = "fixie-ai/" + searchParams.get('model');
  }

  return children({ showMuteSpeakerButton, modelOverride, showDebugMessages, showUserTranscripts });
}

export default function Home() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [agentStatus, setAgentStatus] = useState<string>('off');
  const [callTranscript, setCallTranscript] = useState<Transcript[] | null>([]);
  const [callDebugMessages, setCallDebugMessages] = useState<UltravoxExperimentalMessageEvent[]>([]);
  const [customerProfileKey, setCustomerProfileKey] = useState<string | null>(null);
  const [displayedImages, setDisplayedImages] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [usageInfo, setUsageInfo] = useState<{
    freeTimeRemaining: number;
    freeTimeUsed: number;
    hasActiveSubscription: boolean;
    subscriptionTier: string | null;
    allowedConcurrentCalls: number;
    allowedVoices: number;
  } | null>(null);
  const [isCheckingUsage, setIsCheckingUsage] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [callTranscript]);

  useEffect(() => {
    const handleSkylarShowImage = (event: CustomEvent) => {
      console.log("📸 skylar show image event received:", event.detail);

      let imageNames: string[] = [];
      
      if (event.detail) {
        // Handle new format: { imageNames: ['path1', 'path2'] }
        if (typeof event.detail === 'object' && 'imageNames' in event.detail && Array.isArray((event.detail as any).imageNames)) {
          imageNames = (event.detail as any).imageNames;
        }
        // Handle legacy format: { imageName: 'path1,path2' } or 'path1,path2'
        else if (typeof event.detail === 'string') {
          imageNames = event.detail.split(',').map((img: string) => img.trim()).filter((img: string) => img.length > 0);
        } else if (typeof event.detail === 'object' && 'imageName' in event.detail) {
          const imgName = (event.detail as any).imageName;
          if (typeof imgName === 'string') {
            imageNames = imgName.split(',').map((img: string) => img.trim()).filter((img: string) => img.length > 0);
          }
        }
      }

      if (imageNames.length > 0) {
        setDisplayedImages(imageNames);
        console.log("📸 displayedImages state updated to:", imageNames);
      } else {
        console.warn("📸 skylar:showImage event had no valid images:", event.detail);
      }
    };

    const handleSkylarCallEnded = () => {
      console.log('📸 skylar call ended — clearing displayed images');
      setDisplayedImages([]);
    };

    // Register namespaced Skylar events and legacy fallbacks
    window.addEventListener('skylar:showImage', handleSkylarShowImage as EventListener);
    window.addEventListener('showImage', handleSkylarShowImage as EventListener); // legacy support

    window.addEventListener('skylar:callEnded', handleSkylarCallEnded as EventListener);
    window.addEventListener('callEnded', handleSkylarCallEnded as EventListener); // legacy support

    console.log("📸 Skylar image & call-ended listeners registered");

    return () => {
      window.removeEventListener('skylar:showImage', handleSkylarShowImage as EventListener);
      window.removeEventListener('showImage', handleSkylarShowImage as EventListener);

      window.removeEventListener('skylar:callEnded', handleSkylarCallEnded as EventListener);
      window.removeEventListener('callEnded', handleSkylarCallEnded as EventListener);
    };
  }, []);

  const handleStatusChange = useCallback((status: UltravoxSessionStatus | string | undefined) => {
    if(status) {
      setAgentStatus(status);
    } else {
      setAgentStatus('off');
    }
    
  }, []);

  const handleTranscriptChange = useCallback((transcripts: Transcript[] | undefined) => {
    if(transcripts) {
      setCallTranscript([...transcripts]);
    }
  }, []);

  const handleDebugMessage = useCallback((debugMessage: UltravoxExperimentalMessageEvent) => {
    setCallDebugMessages(prevMessages => [...prevMessages, debugMessage]);
  }, []);

  const clearCustomerProfile = useCallback(() => {
    // This will trigger a re-render of CustomerProfileForm with a new empty profile
    setCustomerProfileKey(prev => prev ? `${prev}-cleared` : 'cleared');
  }, []);

  const checkUsage = useCallback(async (key: string) => {
    if (!key.trim()) {
      setUsageInfo(null);
      setApiKeyError(null);
      return;
    }

    setIsCheckingUsage(true);
    setApiKeyError(null);
    try {
      const response = await fetch('/api/usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: key }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check usage');
      }

      const data = await response.json();
      setUsageInfo(data);
    } catch (error) {
      console.error('Error checking usage:', error);
      setUsageInfo(null);
      setApiKeyError(error instanceof Error ? error.message : 'Invalid API key');
    } finally {
      setIsCheckingUsage(false);
    }
  }, []);

  const handleApiKeyChange = useCallback((value: string) => {
    setApiKey(value);
    setApiKeyError(null);
    // Debounce the usage check
    const timeoutId = setTimeout(() => {
      checkUsage(value);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [checkUsage]);

  const handleStartCallButtonClick = async (modelOverride?: string, showDebugMessages?: boolean) => {
    console.log('Start call button clicked');
    try {
      handleStatusChange('Starting call...');
      setCallTranscript(null);
      setCallDebugMessages([]);
      setDisplayedImages([]); // Clear displayed images
      clearCustomerProfile();

      // Generate a new key for the customer profile
      const newKey = `call-${Date.now()}`;
      setCustomerProfileKey(newKey);

      // Setup our call config including the call key as a parameter restriction
      let callConfig: CallConfig = {
        systemPrompt: demoConfig.callConfig.systemPrompt,
        model: modelOverride || demoConfig.callConfig.model,
        languageHint: demoConfig.callConfig.languageHint,
        selectedTools: demoConfig.callConfig.selectedTools,
        voice: demoConfig.callConfig.voice,
        temperature: demoConfig.callConfig.temperature,
        apiKey: apiKey || undefined, // Use user-provided API key
      };

      const paramOverride: { [key: string]: any } = {
        "callId": newKey
      }

      let cpTool: SelectedTool | undefined = demoConfig?.callConfig?.selectedTools?.find(tool => tool.toolName === "createProfile");
      
      if (cpTool) {
        cpTool.parameterOverrides = paramOverride;
      }
      callConfig.selectedTools = demoConfig.callConfig.selectedTools;

      await startCall({
        onStatusChange: handleStatusChange,
        onTranscriptChange: handleTranscriptChange,
        onDebugMessage: handleDebugMessage
      }, callConfig, showDebugMessages);

      setIsCallActive(true);
      handleStatusChange('Call started successfully');
    } catch (error) {
      handleStatusChange(`Error starting call: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleEndCallButtonClick = async () => {
    try {
      handleStatusChange('Ending call...');
      await endCall();
      setIsCallActive(false);

      clearCustomerProfile();
      setCustomerProfileKey(null);
      handleStatusChange('Call ended successfully');
    } catch (error) {
      handleStatusChange(`Error ending call: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsHandler>
        {({ showMuteSpeakerButton, modelOverride, showDebugMessages, showUserTranscripts }: SearchParamsProps) => (
          <div className="flex flex-col items-center justify-center">
            {/* API Key Input and Usage Display */}
            <div className="max-w-[1206px] mx-auto w-full mb-4 p-4 border border-[#2A2A2A] rounded-[3px] bg-gray-900">
              <div className="flex flex-col space-y-4">
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    placeholder="Enter your API key (e.g., AbCdEf.1234567890abcdef...)"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {isCheckingUsage && (
                  <div className="text-sm text-gray-400">Checking usage...</div>
                )}
                
                {apiKeyError && (
                  <div className="text-sm text-red-400 bg-red-900/20 p-2 rounded-md border border-red-800">
                    {apiKeyError}
                  </div>
                )}
                
                {usageInfo && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-gray-800 p-3 rounded-md">
                      <div className="text-gray-300">Remaining Minutes</div>
                      <div className="text-2xl font-bold text-green-400">{usageInfo.freeTimeRemaining}</div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-md">
                      <div className="text-gray-300">Used Minutes</div>
                      <div className="text-2xl font-bold text-blue-400">{usageInfo.freeTimeUsed}</div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-md">
                      <div className="text-gray-300">Subscription</div>
                      <div className="text-lg font-bold text-purple-400">
                        {usageInfo.hasActiveSubscription ? 
                          (usageInfo.subscriptionTier || 'Active') : 
                          'Free Tier'
                        }
                      </div>
                    </div>
                  </div>
                )}
                
                {usageInfo && (
                  <div className="text-xs text-gray-500">
                    Concurrent Calls: {usageInfo.allowedConcurrentCalls} | Voices: {usageInfo.allowedVoices}
                  </div>
                )}
              </div>
            </div>
            {/* Main Area */}
            <div className="max-w-[1206px] mx-auto w-full py-5 pl-5 pr-[10px] border border-[#2A2A2A] rounded-[3px]">
              <div className="flex flex-col justify-center lg:flex-row ">
                {/* Action Area */}
                <div className="w-full lg:w-2/3">
                  <h1 className="text-2xl font-bold w-full">{demoConfig.title}</h1>
                  <div className="flex flex-col justify-between items-start h-full font-mono p-4 ">
                    {!isCallActive && (
                      <div className="mt-20 self-center text-center">
                        <h2 className="text-xl font-semibold mb-4">Skylar - The House of Advertising</h2>
                        <p className="text-gray-300">Ready to showcase our comprehensive advertising solutions</p>
                      </div>
                    )}
                    {isCallActive ? (
                      <div className="w-full">
                        {displayedImages.length > 0 && (
                          <div className="mb-4">
                            <div className={`grid gap-3 ${
                              displayedImages.length === 1 ? 'grid-cols-1' :
                              displayedImages.length === 2 ? 'grid-cols-2' :
                              displayedImages.length === 3 ? 'grid-cols-3' :
                              'grid-cols-2'
                            }`}>
                              {displayedImages.map((image, index) => (
                                <div key={index} className="relative overflow-hidden rounded-lg border-2 border-gray-700 shadow-lg">
                                  <img
                                    src={`/${image}`}
                                    alt={`Skylar service ${index + 1}`}
                                    className="w-full h-auto object-cover"
                                    onError={(e) => {
                                      console.error(`Failed to load image: ${image}`);
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="mb-5 relative">
                          <div 
                            ref={transcriptContainerRef}
                            className="h-[300px] p-2.5 overflow-y-auto relative"
                          >
                            {callTranscript && callTranscript.map((transcript, index) => (
                              <div key={index}>
                                {showUserTranscripts ? (
                                  <>
                                    <p><span className="text-gray-600">{transcript.speaker === 'agent' ? "Skylar" : "User"}</span></p>
                                    <p className="mb-4"><span>{transcript.text}</span></p>
                                  </>
                                ) : (
                                  transcript.speaker === 'agent' && (
                                    <>
                                      <p><span className="text-gray-600">{transcript.speaker === 'agent' ? "Skylar" : "User"}</span></p>
                                      <p className="mb-4"><span>{transcript.text}</span></p>
                                    </>
                                  )
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-t from-transparent to-black pointer-events-none" />
                        </div>
                        <div className="flex justify-between space-x-4 p-4 w-full">
                          <MicToggleButton role={Role.USER}/>
                          { showMuteSpeakerButton && <MicToggleButton role={Role.AGENT}/> }
                          <button
                            type="button"
                            className="flex-grow flex items-center justify-center h-10 bg-red-500"
                            onClick={handleEndCallButtonClick}
                            disabled={!isCallActive}
                          >
                            <PhoneOffIcon width={24} className="brightness-0 invert" />
                            <span className="ml-2">End Call</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="h-[300px] text-gray-400 mb-6 mt-32 lg:mt-0">
                          {demoConfig.overview}
                        </div>
                        <button
                          type="button"
                          className="hover:bg-gray-700 px-6 py-2 border-2 w-full mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleStartCallButtonClick(modelOverride, showDebugMessages)}
                          disabled={!apiKey.trim() || !usageInfo}
                        >
                          {usageInfo ? 'Start Call' : 'Enter API Key to Start Call'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Call Status */}
                <CallStatus status={agentStatus}>
                  <OrderDetails />
                </CallStatus>
              </div>
            </div>
            
            {/* Detailed Campaign Builder - Full Width Below Main Area */}
            <DetailedCampaignView />
            
            {/* Debug View */}
            <DebugMessages debugMessages={callDebugMessages} />
          </div>
        )}
      </SearchParamsHandler>
    </Suspense>
  )
}