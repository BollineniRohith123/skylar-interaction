'use client';

import React, { useState, useEffect } from 'react';
import { OrderDetailsData, OrderItem } from '@/lib/types';

// Campaign strategy interface
interface CampaignStrategy {
  totalBudget: number;
  duration: number; // in months
  campaignGoal: string; // Brand Awareness, Product Launch, etc.
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

function prepOrderDetails(orderDetailsData: OrderItem[]): OrderDetailsData {
  try {
    // console.log(`orderDetails: ${orderDetailsData}`);
    // const parsedItems: OrderItem[] = JSON.parse(orderDetailsData);
    // console.log(`parsedItems: ${JSON.stringify(parsedItems)}`);


    const totalAmount = orderDetailsData.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    // console.log(`parsedItems: ${JSON.stringify(parsedItems)}`);
    // console.log(totalAmount);

    // Construct the final order details object with total amount
    const orderDetails: OrderDetailsData = {
      items: orderDetailsData,
      totalAmount: Number(totalAmount.toFixed(2))
    };

    return orderDetails;
  } catch (error) {
    throw new Error(`Failed to parse order details: ${error}`, { cause: error });
  }
}

const OrderDetails: React.FC = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetailsData>({
    items: [],
    totalAmount: 0
  });

  const [campaignStrategy, setCampaignStrategy] = useState<CampaignStrategy | null>(null);

  useEffect(() => {
    const handleOrderUpdate = (event: CustomEvent<any>) => {
      console.log(`got event: ${JSON.stringify(event.detail)}`);

      let parsedItems: OrderItem[] = [];
      try {
        if (typeof event.detail === 'string') {
          parsedItems = JSON.parse(event.detail);
        } else if (Array.isArray(event.detail)) {

          parsedItems = event.detail;
        } else {
          console.error('Unexpected event.detail format:', event.detail);
          return;
        }

        // Validate that we have an array of items
        if (!Array.isArray(parsedItems)) {
          throw new Error('Event detail is not an array of items');
        }

        const formattedData: OrderDetailsData = prepOrderDetails(parsedItems);
        setOrderDetails(formattedData);
      } catch (error) {
        console.error('Failed to process order details:', error);
        console.error('Event detail type:', typeof event.detail);
        console.error('Event detail value:', event.detail);
        return;
      }
    };

    const handleCampaignUpdate = (event: CustomEvent<any>) => {
      console.log(`Campaign strategy received: ${JSON.stringify(event.detail)}`);
      try {
        const strategy = typeof event.detail === 'string' ? JSON.parse(event.detail) : event.detail;
        setCampaignStrategy(strategy);
      } catch (error) {
        console.error('Failed to process campaign strategy:', error);
      }
    };

    const handleCallEnded = () => {
      setOrderDetails({
        items: [],
        totalAmount: 0
      });
      setCampaignStrategy(null);
    };

    window.addEventListener('orderDetailsUpdated', handleOrderUpdate as EventListener);
    window.addEventListener('campaignStrategyUpdated', handleCampaignUpdate as EventListener);
    window.addEventListener('callEnded', handleCallEnded as EventListener);

    return () => {
      window.removeEventListener('orderDetailsUpdated', handleOrderUpdate as EventListener);
      window.removeEventListener('campaignStrategyUpdated', handleCampaignUpdate as EventListener);
      window.removeEventListener('callEnded', handleCallEnded as EventListener);
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatINR = (amount: number) => {
    const lakh = amount / 100000;
    return `₹${lakh.toFixed(2)}L`;
  };

  const formatOrderItem = (item: OrderItem, index: number) => (
    <div key={index} className="mb-2 pl-4 border-l-2 border-gray-200">
      <div className="flex justify-between items-center">
        <span className="font-medium">{item.quantity}x {item.name}</span>
        <span className="text-gray-600">{formatCurrency(item.price * item.quantity)}</span>
      </div>
      {item.specialInstructions && (
        <div className="text-sm text-gray-500 italic mt-1">
          Note: {item.specialInstructions}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-10">
      <h1 className="text-xl font-bold mb-4">Campaign Builder</h1>
      
      {/* Sidebar Summary - Basic Details */}
      {campaignStrategy && (
        <div className="mb-6">
          {/* Basic Campaign Info for Sidebar */}
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Campaign Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Campaign Goal:</span>
                <span className="text-white font-medium">{campaignStrategy.campaignGoal}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Duration:</span>
                <span className="text-blue-400 font-bold">{campaignStrategy.duration} months</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Budget:</span>
                <span className="text-green-400 font-bold">{formatINR(campaignStrategy.totalBudget)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Target Audience:</span>
                <span className="text-white font-medium">{campaignStrategy.targetAudience}</span>
              </div>
              
              <div className="border-t border-gray-600 pt-2 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Expected Impressions:</span>
                  <span className="text-blue-400 font-bold">{(campaignStrategy.impact.totalImpressions / 100000).toFixed(2)}L</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Unique Reach:</span>
                  <span className="text-cyan-400 font-bold">{(campaignStrategy.impact.uniqueReach / 100000).toFixed(2)}L</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Brand Awareness Lift:</span>
                  <span className="text-yellow-400 font-bold">{campaignStrategy.impact.expectedROI}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Section (Original) */}
      {orderDetails.items.length > 0 && (
        <div className="shadow-md rounded p-4 bg-gray-900 border border-gray-700 mb-6">
          <div className="mb-4">
            <span className="text-gray-400 font-mono mb-2 block">Items:</span>
            {orderDetails.items.map((item, index) => formatOrderItem(item, index))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center font-bold">
              <span className="text-gray-400 font-mono">Total:</span>
              <span>{formatCurrency(orderDetails.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!campaignStrategy && orderDetails.items.length === 0 && (
        <div className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="bg-blue-900 rounded-full p-4">
              <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Ready to Build Your Campaign?</h3>
              <p className="text-gray-400">Start a call and tell us about your brand awareness goals and budget.</p>
              <p className="text-gray-500 text-sm mt-2">Example: "I need a branding campaign for 5 lakh rupees to increase brand awareness"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;