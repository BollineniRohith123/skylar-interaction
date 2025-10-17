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
