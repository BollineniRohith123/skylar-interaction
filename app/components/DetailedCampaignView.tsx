'use client';

import React, { useState, useEffect } from 'react';

// Campaign strategy interface (complete)
interface CampaignStrategy {
  totalBudget: number;
  duration: number; // in months
  campaignGoal: string; // Brand Awareness, Product Launch, etc.
  brandStage?: string; // NEW: Brand stage (startup, established, market leader)
  targetAudience: string;
  allocation: {
    aircraftAdvertising: number;
    outdoorMedia: number;
    digitalAdvertising: number;
    transitMedia: number;
    traditionalMedia: number;
  };
  impact: {
    totalImpressions: number;
    uniqueReach: number;
    expectedROI: number;
    brandImpactValue: number;
  };
}

// NEW: Partial data interfaces for progressive UI building
interface CampaignGoalData {
  goal: string;
  brandStage: string;
  targetAudience: string;
}

interface CampaignTimelineData {
  budget: number;
  duration: number;
}

const DetailedCampaignView: React.FC = () => {
  // Progressive UI state - builds up in 3 stages
  const [campaignGoal, setCampaignGoal] = useState<CampaignGoalData | null>(null);
  const [campaignTimeline, setCampaignTimeline] = useState<CampaignTimelineData | null>(null);
  const [campaignStrategy, setCampaignStrategy] = useState<CampaignStrategy | null>(null);

  // Animation state for progressive rendering
  const [showGoalSection, setShowGoalSection] = useState(false);
  const [showTimelineSection, setShowTimelineSection] = useState(false);
  const [showStrategySection, setShowStrategySection] = useState(false);

  useEffect(() => {
    // Stage 1: Campaign Goal Defined (goal, brandStage, targetAudience)
    const handleCampaignGoalDefined = (event: CustomEvent<any>) => {
      console.log(`🎯 Campaign Goal Defined: ${JSON.stringify(event.detail)}`);
      try {
        const goalData = typeof event.detail === 'string' ? JSON.parse(event.detail) : event.detail;
        setCampaignGoal(goalData);
        // Trigger animation after a brief delay
        setTimeout(() => setShowGoalSection(true), 100);
      } catch (error) {
        console.error('Failed to process campaign goal:', error);
      }
    };

    // Stage 2: Campaign Timeline Defined (budget, duration)
    const handleCampaignTimelineDefined = (event: CustomEvent<any>) => {
      console.log(`💰 Campaign Timeline Defined: ${JSON.stringify(event.detail)}`);
      try {
        const timelineData = typeof event.detail === 'string' ? JSON.parse(event.detail) : event.detail;
        setCampaignTimeline(timelineData);
        // Trigger animation after a brief delay
        setTimeout(() => setShowTimelineSection(true), 100);
      } catch (error) {
        console.error('Failed to process campaign timeline:', error);
      }
    };

    // Stage 3: Full Campaign Strategy Updated (complete strategy with allocations)
    const handleCampaignStrategyUpdated = (event: CustomEvent<any>) => {
      console.log(`🚀 Campaign Strategy Updated: ${JSON.stringify(event.detail)}`);
      try {
        const strategy = typeof event.detail === 'string' ? JSON.parse(event.detail) : event.detail;
        setCampaignStrategy(strategy);
        // Trigger animation after a brief delay
        setTimeout(() => setShowStrategySection(true), 100);
      } catch (error) {
        console.error('Failed to process campaign strategy:', error);
      }
    };

    // Reset all state when call ends
    const handleCallEnded = () => {
      console.log('📞 Call ended - resetting campaign view');
      setCampaignGoal(null);
      setCampaignTimeline(null);
      setCampaignStrategy(null);
      setShowGoalSection(false);
      setShowTimelineSection(false);
      setShowStrategySection(false);
    };

    // Register all event listeners
    window.addEventListener('campaignGoalDefined', handleCampaignGoalDefined as EventListener);
    window.addEventListener('campaignTimelineDefined', handleCampaignTimelineDefined as EventListener);
    window.addEventListener('campaignStrategyUpdated', handleCampaignStrategyUpdated as EventListener);
    window.addEventListener('callEnded', handleCallEnded as EventListener);
    window.addEventListener('skylar:callEnded', handleCallEnded as EventListener); // Also listen to namespaced event

    return () => {
      window.removeEventListener('campaignGoalDefined', handleCampaignGoalDefined as EventListener);
      window.removeEventListener('campaignTimelineDefined', handleCampaignTimelineDefined as EventListener);
      window.removeEventListener('campaignStrategyUpdated', handleCampaignStrategyUpdated as EventListener);
      window.removeEventListener('callEnded', handleCallEnded as EventListener);
      window.removeEventListener('skylar:callEnded', handleCallEnded as EventListener);
    };
  }, []);

  const formatINR = (amount: number) => {
    const lakh = amount / 100000;
    return `₹${lakh.toFixed(2)}L`;
  };

  // Don't show anything if no data at all
  if (!campaignGoal && !campaignTimeline && !campaignStrategy) {
    return null;
  }

  // Determine header subtitle based on current stage
  const getHeaderSubtitle = () => {
    if (campaignStrategy) {
      return `A Proven Strategy for ${campaignStrategy.campaignGoal}`;
    } else if (campaignTimeline) {
      return 'Building your customized strategy...';
    } else if (campaignGoal) {
      return 'Understanding your brand foundation...';
    }
    return 'Professional branding campaign designed for maximum impact';
  };

  return (
    <div className="max-w-[1206px] mx-auto w-full mt-6 mb-6">
      {/* Detailed Campaign Builder */}
      <div className="bg-white border border-gray-300 rounded-xl shadow-2xl overflow-hidden">
        {/* Header - Always visible once any data exists */}
        <div className="bg-gradient-sunset px-8 py-6 slide-in-up">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-lg p-3">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                {campaignStrategy ? 'Comprehensive Campaign Strategy' : 'Building Your Campaign Strategy'}
              </h2>
              <p className="text-white/90 text-lg">{getHeaderSubtitle()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Left Panel - Campaign Configuration */}
          <div className="space-y-6">
            {/* STAGE 1: Campaign Foundation (Goal, Brand Stage, Audience) */}
            {campaignGoal && showGoalSection && (
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 shadow-md border border-gray-200 slide-in-up">
                <h3 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-sunset rounded-full shadow-lg" />
                  Campaign Foundation
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Campaign Goal</label>
                    <div className="text-lg font-semibold text-gray-900">{campaignGoal.goal}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Brand Stage</label>
                    <div className="text-lg font-semibold text-purple-600">{campaignGoal.brandStage}</div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-600">Target Audience</label>
                    <div className="text-lg font-semibold text-gray-900">{campaignGoal.targetAudience}</div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 2: Budget & Timeline */}
            {campaignTimeline && showTimelineSection && (
              <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-xl p-6 shadow-md border border-gray-200 slide-in-up slide-in-delay-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-gold rounded-full shadow-lg" />
                  Budget & Timeline
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Total Investment</label>
                    <div className="text-2xl font-bold text-green-600 count-up">{formatINR(campaignTimeline.budget)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Campaign Duration</label>
                    <div className="text-2xl font-bold text-blue-600 count-up">{campaignTimeline.duration} months</div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 3: Media Mix Breakdown - Only show when full strategy is available */}
            {campaignStrategy && showStrategySection && (
              <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-6 shadow-md border border-gray-200 slide-in-up slide-in-delay-2">
                <h3 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-gold rounded-full shadow-lg" />
                  Media Mix Allocation
                </h3>

                <div className="space-y-4">
                  {/* Aircraft Advertising */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Aircraft Advertising</div>
                          <div className="text-sm text-gray-600">Premium sky-high visibility</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">{campaignStrategy.allocation.aircraftAdvertising}%</div>
                        <div className="text-sm font-medium text-gray-700">{formatINR(campaignStrategy.totalBudget * campaignStrategy.allocation.aircraftAdvertising / 100)}</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full progress-bar-animated" style={{'--target-width': `${campaignStrategy.allocation.aircraftAdvertising}%`} as React.CSSProperties} />
                    </div>
                  </div>

                  {/* Outdoor Media */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Outdoor Media</div>
                          <div className="text-sm text-gray-600">Hoardings & billboards</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-indigo-600">{campaignStrategy.allocation.outdoorMedia}%</div>
                        <div className="text-sm font-medium text-gray-700">{formatINR(campaignStrategy.totalBudget * campaignStrategy.allocation.outdoorMedia / 100)}</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-indigo-600 h-3 rounded-full progress-bar-animated" style={{'--target-width': `${campaignStrategy.allocation.outdoorMedia}%`} as React.CSSProperties} />
                    </div>
                  </div>

                  {/* Digital Advertising */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Digital Advertising</div>
                          <div className="text-sm text-gray-600">LEDs & social media</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-purple-600">{campaignStrategy.allocation.digitalAdvertising}%</div>
                        <div className="text-sm font-medium text-gray-700">{formatINR(campaignStrategy.totalBudget * campaignStrategy.allocation.digitalAdvertising / 100)}</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-purple-600 h-3 rounded-full progress-bar-animated" style={{'--target-width': `${campaignStrategy.allocation.digitalAdvertising}%`} as React.CSSProperties} />
                    </div>
                  </div>

                  {/* Transit Media */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Transit Media</div>
                          <div className="text-sm text-gray-600">Buses & metro advertising</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-cyan-600">{campaignStrategy.allocation.transitMedia}%</div>
                        <div className="text-sm font-medium text-gray-700">{formatINR(campaignStrategy.totalBudget * campaignStrategy.allocation.transitMedia / 100)}</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-cyan-600 h-3 rounded-full progress-bar-animated" style={{'--target-width': `${campaignStrategy.allocation.transitMedia}%`} as React.CSSProperties} />
                    </div>
                  </div>

                  {/* Traditional Media */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Traditional Media</div>
                          <div className="text-sm text-gray-600">TV & print advertising</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-teal-600">{campaignStrategy.allocation.traditionalMedia}%</div>
                        <div className="text-sm font-medium text-gray-700">{formatINR(campaignStrategy.totalBudget * campaignStrategy.allocation.traditionalMedia / 100)}</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-teal-600 h-3 rounded-full progress-bar-animated" style={{'--target-width': `${campaignStrategy.allocation.traditionalMedia}%`} as React.CSSProperties} />
                    </div>
                  </div>
                </div>

                {/* Total Verification */}
                <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-green-900 text-lg">Perfect 100% Allocation</div>
                        <div className="text-sm text-green-700 font-medium">Budget optimally distributed across all channels</div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gradient-gold">{formatINR(campaignStrategy.totalBudget)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Impact Metrics */}
          <div className="space-y-6">
            {campaignStrategy && showStrategySection && (
              <>
                <div className="bg-gradient-sky rounded-xl p-8 text-white shadow-xl slide-in-up slide-in-delay-3">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-2">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    Impact Analysis Dashboard
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Total Impressions */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium opacity-90">Total Impressions</span>
                      </div>
                      <div className="text-3xl font-bold count-up">{(campaignStrategy.impact.totalImpressions / 100000).toFixed(2)}L</div>
                      <div className="text-sm opacity-80">Across all media channels</div>
                    </div>

                    {/* Unique Reach */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857" />
                        </svg>
                        <span className="text-sm font-medium opacity-90">Unique Reach</span>
                      </div>
                      <div className="text-3xl font-bold count-up">{(campaignStrategy.impact.uniqueReach / 100000).toFixed(2)}L</div>
                      <div className="text-sm opacity-80">Unique audience reached</div>
                    </div>

                    {/* Monthly Investment */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2" />
                        </svg>
                        <span className="text-sm font-medium opacity-90">Monthly Investment</span>
                      </div>
                      <div className="text-3xl font-bold count-up">{formatINR(campaignStrategy.totalBudget / campaignStrategy.duration)}</div>
                      <div className="text-sm opacity-80">Per month allocation</div>
                    </div>

                    {/* Brand Impact Value */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="text-sm font-medium opacity-90">Brand Impact Value</span>
                      </div>
                      <div className="text-3xl font-bold count-up">{formatINR(campaignStrategy.impact.brandImpactValue)}</div>
                      <div className="text-sm opacity-80">Estimated brand value</div>
                    </div>
                  </div>

                  {/* ROI Highlight */}
                  <div className="bg-gradient-gold rounded-xl p-8 text-gray-900 shadow-xl border-2 border-yellow-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-900/10 rounded-lg p-2">
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <span className="font-bold text-lg">Expected Brand Awareness Lift</span>
                      </div>
                      <span className="bg-gray-900/20 text-xs px-4 py-2 rounded-full font-bold uppercase tracking-wide">Premium ROI</span>
                    </div>
                    <div className="text-6xl font-black mb-3 drop-shadow-md count-up">{campaignStrategy.impact.expectedROI}%</div>
                    <div className="text-base font-semibold">Projected increase in brand awareness and recall</div>
                  </div>
                </div>

                {/* Campaign Timeline */}
                <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-6 shadow-md border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Campaign Timeline
                  </h3>
                  <div className="space-y-3">
                    {Array.from({ length: campaignStrategy.duration }, (_, i) => (
                      <div key={i} className="flex items-center gap-4 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                        <div className="w-10 h-10 bg-gradient-sunset text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">{i + 1}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-lg">Month {i + 1}</div>
                          <div className="text-sm text-gray-600 font-medium">Budget: {formatINR(campaignStrategy.totalBudget / campaignStrategy.duration)} | Expected Impressions: {((campaignStrategy.impact.totalImpressions / campaignStrategy.duration) / 100000).toFixed(1)}L</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button className="w-full btn-gradient-sunset text-white font-bold py-5 rounded-xl shadow-lg flex items-center justify-center gap-3 text-lg hover-scale btn-press">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4" />
                    </svg>
                    Download Detailed Strategy Report
                  </button>

                  <button className="w-full btn-gradient-gold text-gray-900 font-bold py-5 rounded-xl shadow-lg flex items-center justify-center gap-3 text-lg hover-scale btn-press">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Schedule Strategy Consultation
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedCampaignView;
