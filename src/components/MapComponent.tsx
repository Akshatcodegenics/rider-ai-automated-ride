
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Zap } from "lucide-react";

interface MapComponentProps {
  pickup: string;
  destination: string;
}

const MapComponent = ({ pickup, destination }: MapComponentProps) => {
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  // Mock map placeholder with route visualization
  const renderMockMap = () => (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden">
      {/* Mock map background */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-8 grid-rows-6 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-gray-300"></div>
          ))}
        </div>
      </div>
      
      {/* Mock route line */}
      {pickup && destination && (
        <svg className="absolute inset-0 w-full h-full">
          <path
            d="M 100 300 Q 200 150 400 100"
            stroke="#3B82F6"
            strokeWidth="4"
            fill="none"
            strokeDasharray="8,4"
            className="animate-pulse"
          />
        </svg>
      )}
      
      {/* Mock pickup marker */}
      {pickup && (
        <div className="absolute top-20 left-20 flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
          <div className="bg-white px-2 py-1 rounded shadow text-xs font-medium">
            Pickup: {pickup}
          </div>
        </div>
      )}
      
      {/* Mock destination marker */}
      {destination && (
        <div className="absolute bottom-20 right-20 flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
          <div className="bg-white px-2 py-1 rounded shadow text-xs font-medium">
            Destination: {destination}
          </div>
        </div>
      )}
      
      {/* Mock driver markers */}
      <div className="absolute top-32 left-32 w-3 h-3 bg-blue-500 rounded-full border border-white shadow animate-bounce"></div>
      <div className="absolute top-48 right-32 w-3 h-3 bg-blue-500 rounded-full border border-white shadow animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-32 left-48 w-3 h-3 bg-blue-500 rounded-full border border-white shadow animate-bounce" style={{ animationDelay: '1s' }}></div>
      
      {/* Map overlay info */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 text-sm">
          <Zap className="h-4 w-4 text-blue-600" />
          <span className="font-medium">Live Map Preview</span>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          3 drivers nearby
        </div>
      </div>
    </div>
  );

  if (showTokenInput && !mapboxToken) {
    return (
      <Card className="p-6 border-0 shadow-lg">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold">Map Integration</h3>
          <p className="text-sm text-gray-600">
            To enable live maps, please enter your Mapbox public token or use the preview mode below.
          </p>
          <div className="space-y-3">
            <Input
              placeholder="Enter Mapbox public token (optional)"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <div className="flex gap-2">
              <Button 
                onClick={() => setMapboxToken('demo-token')}
                className="flex-1"
              >
                Use Map
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowTokenInput(false)}
                className="flex-1"
              >
                Preview Mode
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Get your free token at{' '}
            <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              mapbox.com
            </a>
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      {renderMockMap()}
      
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Live Tracking Active</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowTokenInput(true)}>
            Configure Map
          </Button>
        </div>
        
        {pickup && destination && (
          <div className="mt-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Distance:</span>
              <span className="font-medium">~12.3 km</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-medium">~18 mins</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MapComponent;
