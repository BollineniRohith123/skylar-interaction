import { ClientToolImplementation } from 'ultravox-client';

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
    // Dispatch a custom event to trigger call ending
    const event = new CustomEvent("skylar:endCall", {
      detail: { message: message || "Thank you for using Skylar's services. We look forward to helping you build your brand presence." },
    });
    window.dispatchEvent(event);
    console.log("📞 skylar:endCall Custom event dispatched");
  }

  return message || "Thank you for using Skylar's services. We look forward to helping you build your brand presence.";
};
