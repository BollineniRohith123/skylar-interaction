import { ClientToolImplementation } from 'ultravox-client';

// Global state to store campaign data across sequential tool calls
// This allows buildAndExplainStrategy to access data from previous tools
let campaignState = {
  goal: '',
  brandStage: '',
  targetAudience: '',
  budget: 0,
  duration: 0
};

// Client-implemented tool for Order Details
export const updateOrderTool: ClientToolImplementation = (parameters) => {
  const { ...orderData } = parameters;
  console.debug("Received order details update:", orderData.orderDetailsData);

  if (typeof window !== "undefined") {
    const event = new CustomEvent("orderDetailsUpdated", {
      detail: orderData.orderDetailsData,
    });
    window.dispatchEvent(event);
  }

  return "Updated the order details.";
};

// Client-implemented tool for showing images (Skylar)
export const showImageTool: ClientToolImplementation = (parameters) => {
  const { imageName } = parameters as any;
  console.log("🖼️ Show Image Tool Called with:", imageName);
  console.log("🖼️ Full parameters:", parameters);

  if (typeof window !== "undefined") {
    // Handle comma-separated images for multiple display
    let imageNames: string[] = [];
    
    if (typeof imageName === 'string') {
      // Split by comma if multiple images provided
      imageNames = imageName.split(',').map(img => img.trim()).filter(img => img.length > 0);
    }
    
    // Skylar-specific event uses a namespaced event and object detail
    const event = new CustomEvent("skylar:showImage", {
      detail: { imageNames },
    });
    window.dispatchEvent(event);
    console.log("🖼️ skylar:showImage Custom event dispatched for:", imageNames);
  }

  return `Displayed ${imageName.split(',').length} image(s): ${imageName}`;
};

// NEW: Sequential Tool 1/3 - Set Campaign Goal
export const setCampaignGoalTool: ClientToolImplementation = (parameters) => {
  const { goal, brandStage, targetAudience } = parameters as any;
  console.log("🎯 Step 1/3: Campaign Goal Tool Called");
  console.log("🎯 Parameters:", { goal, brandStage, targetAudience });

  // Store in global state for later use
  campaignState.goal = goal || '';
  campaignState.brandStage = brandStage || '';
  campaignState.targetAudience = targetAudience || '';

  if (typeof window !== "undefined") {
    const goalData = {
      goal: goal || '',
      brandStage: brandStage || '',
      targetAudience: targetAudience || ''
    };

    // Dispatch event for progressive UI building
    const event = new CustomEvent("campaignGoalDefined", {
      detail: goalData,
    });
    window.dispatchEvent(event);
    console.log("🎯 campaignGoalDefined event dispatched:", goalData);
  }

  return `Campaign goal captured: ${goal} for ${brandStage} targeting ${targetAudience}. Ready for budget and timeline.`;
};

// NEW: Sequential Tool 2/3 - Set Campaign Timeline
export const setCampaignTimelineTool: ClientToolImplementation = (parameters) => {
  const { budget, duration } = parameters as any;
  console.log("💰 Step 2/3: Campaign Timeline Tool Called");
  console.log("💰 Parameters:", { budget, duration });

  // Store in global state for later use
  campaignState.budget = parseFloat(budget) || 0;
  campaignState.duration = parseInt(duration) || 3;

  if (typeof window !== "undefined") {
    const timelineData = {
      budget: parseFloat(budget) || 0,
      duration: parseInt(duration) || 3
    };

    // Dispatch event for progressive UI building
    const event = new CustomEvent("campaignTimelineDefined", {
      detail: timelineData,
    });
    window.dispatchEvent(event);
    console.log("💰 campaignTimelineDefined event dispatched:", timelineData);
  }

  const budgetInLakhs = (parseFloat(budget) / 100000).toFixed(2);
  return `Budget of ₹${budgetInLakhs}L for ${duration} months captured. Ready to build your strategy.`;
};

// NEW: Sequential Tool 3/3 - Build and Explain Strategy
export const buildAndExplainStrategyTool: ClientToolImplementation = () => {
  console.log("🚀 Step 3/3: Build and Explain Strategy Tool Called");
  console.log("🚀 Using campaign state:", campaignState);

  if (typeof window !== "undefined") {
    const budget = campaignState.budget;
    const duration = campaignState.duration;
    const goal = campaignState.goal;
    const brandStage = campaignState.brandStage;
    const targetAudience = campaignState.targetAudience;

    // Calculate optimal allocation based on goal and brand stage
    let allocation = {
      aircraftAdvertising: 40,
      outdoorMedia: 25,
      digitalAdvertising: 20,
      transitMedia: 10,
      traditionalMedia: 5
    };

    // Adjust allocation based on goal and brand stage
    if (goal.toLowerCase().includes('launch') || goal.toLowerCase().includes('new')) {
      if (brandStage.toLowerCase().includes('startup') || brandStage.toLowerCase().includes('new')) {
        // New startup launch: Focus on digital and outdoor
        allocation = {
          aircraftAdvertising: 30,
          outdoorMedia: 30,
          digitalAdvertising: 25,
          transitMedia: 10,
          traditionalMedia: 5
        };
      } else if (brandStage.toLowerCase().includes('established') || brandStage.toLowerCase().includes('market leader')) {
        // Established brand launch: Premium focus with aircraft
        allocation = {
          aircraftAdvertising: 45,
          outdoorMedia: 25,
          digitalAdvertising: 15,
          transitMedia: 10,
          traditionalMedia: 5
        };
      }
    } else if (goal.toLowerCase().includes('awareness') || goal.toLowerCase().includes('grow')) {
      if (brandStage.toLowerCase().includes('startup') || brandStage.toLowerCase().includes('new')) {
        // Startup awareness: Digital-first approach
        allocation = {
          aircraftAdvertising: 25,
          outdoorMedia: 30,
          digitalAdvertising: 30,
          transitMedia: 10,
          traditionalMedia: 5
        };
      } else {
        // Established brand awareness: Balanced approach
        allocation = {
          aircraftAdvertising: 35,
          outdoorMedia: 30,
          digitalAdvertising: 20,
          transitMedia: 10,
          traditionalMedia: 5
        };
      }
    } else if (goal.toLowerCase().includes('event') || goal.toLowerCase().includes('promote')) {
      // Event promotion: High visibility channels
      allocation = {
        aircraftAdvertising: 35,
        outdoorMedia: 35,
        digitalAdvertising: 20,
        transitMedia: 8,
        traditionalMedia: 2
      };
    }

    // Calculate impact metrics
    const totalImpressions = Math.round(budget * 85); // Approx 85 impressions per rupee
    const uniqueReach = Math.round(totalImpressions * 0.65); // 65% unique reach ratio
    const expectedROI = Math.round(150 + (budget / 100000) * 50); // Base 150% + 50% per lakh
    const brandImpactValue = Math.round(budget * 1.9); // Brand impact multiplier

    const campaignData = {
      totalBudget: budget,
      duration: duration,
      campaignGoal: goal,
      brandStage: brandStage,
      targetAudience: targetAudience,
      allocation: allocation,
      impact: {
        totalImpressions,
        uniqueReach,
        expectedROI,
        brandImpactValue
      }
    };

    const event = new CustomEvent("campaignStrategyUpdated", {
      detail: campaignData,
    });
    window.dispatchEvent(event);
    console.log("🚀 Campaign strategy event dispatched:", campaignData);

    // Reset state for next campaign
    campaignState = {
      goal: '',
      brandStage: '',
      targetAudience: '',
      budget: 0,
      duration: 0
    };

    return `Strategy built successfully for ${goal}. Expected ${(totalImpressions / 100000).toFixed(1)}L impressions with ${expectedROI}% brand awareness lift.`;
  }

  return "Strategy building failed - window not available.";
};

// LEGACY: Keep old tool for backward compatibility (deprecated)
// Client-implemented tool for campaign strategy (Skylar)
export const createCampaignStrategyTool: ClientToolImplementation = (parameters) => {
  const { 
    totalBudget, 
    duration,
    campaignGoal, 
    targetAudience,
    aircraftAdvertising, 
    outdoorMedia, 
    digitalAdvertising, 
    transitMedia, 
    traditionalMedia 
  } = parameters as any;
  console.log("🎯 Campaign Strategy Tool Called");
  console.log("🎯 Full parameters:", parameters);

  if (typeof window !== "undefined") {
    // Calculate impact metrics based on budget and allocation
    const budget = parseFloat(totalBudget) || 0;
    const totalImpressions = Math.round(budget * 85); // Approx 85 impressions per rupee
    const uniqueReach = Math.round(totalImpressions * 0.65); // 65% unique reach ratio
    const expectedROI = Math.round(150 + (budget / 100000) * 50); // Base 150% + 50% per lakh
    const brandImpactValue = Math.round(budget * 1.9); // Brand impact multiplier

    const campaignData = {
      totalBudget: budget,
      duration: parseInt(duration) || 3,
      campaignGoal: campaignGoal || "Brand Awareness",
      targetAudience: targetAudience || "Mass Market (18-55)",
      allocation: {
        aircraftAdvertising: parseFloat(aircraftAdvertising) || 0,
        outdoorMedia: parseFloat(outdoorMedia) || 0,
        digitalAdvertising: parseFloat(digitalAdvertising) || 0,
        transitMedia: parseFloat(transitMedia) || 0,
        traditionalMedia: parseFloat(traditionalMedia) || 0,
      },
      impact: {
        totalImpressions,
        uniqueReach,
        expectedROI,
        brandImpactValue
      }
    };

    const event = new CustomEvent("campaignStrategyUpdated", {
      detail: campaignData,
    });
    window.dispatchEvent(event);
    console.log("🎯 Campaign strategy event dispatched:", campaignData);
  }

  return `Campaign strategy created for ₹${(parseFloat(totalBudget) / 100000).toFixed(2)}L focused on ${campaignGoal} over ${duration} months. Expected ${Math.round((parseFloat(totalBudget) * 85) / 100000).toFixed(1)}L impressions with ${150 + (parseFloat(totalBudget) / 100000) * 50}% brand awareness lift.`;
};

// Client-implemented tool for ending calls (Skylar)
export const endCallTool: ClientToolImplementation = (parameters) => {
  const { message } = parameters as any;
  console.log("📞 End Call Tool Called with message:", message);

  if (typeof window !== "undefined") {
    // Reset campaign state on call end
    campaignState = {
      goal: '',
      brandStage: '',
      targetAudience: '',
      budget: 0,
      duration: 0
    };

    // Dispatch a custom event to trigger call ending
    const event = new CustomEvent("skylar:endCall", {
      detail: { message: message || "Thank you for using Skylar's services. We look forward to helping you build your brand presence." },
    });
    window.dispatchEvent(event);
    console.log("📞 skylar:endCall Custom event dispatched");
  }

  return message || "Thank you for using Skylar's services. We look forward to helping you build your brand presence.";
};
