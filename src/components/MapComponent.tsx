
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Zap, Map, Car } from "lucide-react";

interface MapComponentProps {
  pickup: string;
  destination: string;
}

const MapComponent = ({ pickup, destination }: MapComponentProps) => {
  const [useOpenStreetMap, setUseOpenStreetMap] = useState(true);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  // Calculate coordinates for locations (mock geocoding)
  const getCoordinates = (location: string): [number, number] => {
    const locations: { [key: string]: [number, number] } = {
      'current location': [40.7128, -74.0060],
      'airport': [40.6413, -73.7781],
      'downtown': [40.7589, -73.9851],
      'mall': [40.7505, -73.9934],
      'train station': [40.7505, -73.9934],
      'hospital': [40.7794, -73.9632],
      'university': [40.8075, -73.9626],
      'city center': [40.7614, -73.9776],
      'metro station': [40.7488, -73.9857],
      'stadium': [40.8296, -73.9262],
      'beach': [40.5755, -73.9707]
    };
    
    // Clean location string for matching
    const cleanLocation = location.toLowerCase()
      .replace(/📍|🎯|🏢|🏙️|🛍️|🚆|🏥|🎓|🏛️|🏪|🏟️|🏝️|🏠|🍕|☕|🎬|🏋️|💇/g, '')
      .replace(/\s*-\s*.*/g, '') // Remove everything after dash
      .replace(/\(.*\)/g, '') // Remove coordinates in parentheses
      .trim();
    
    // Try to find exact match first
    if (locations[cleanLocation]) {
      return locations[cleanLocation];
    }
    
    // Try partial matches
    for (const [key, coords] of Object.entries(locations)) {
      if (cleanLocation.includes(key) || key.includes(cleanLocation)) {
        return coords;
      }
    }
    
    // Default to random nearby location
    return [40.7128 + (Math.random() - 0.5) * 0.1, -74.0060 + (Math.random() - 0.5) * 0.1];
  };

  const renderOpenStreetMap = () => {
    const pickupCoords = pickup ? getCoordinates(pickup) : null;
    const destCoords = destination ? getCoordinates(destination) : null;
    
    // Calculate center point if both locations are set
    let centerLat = 40.7128;
    let centerLng = -74.0060;
    let zoomLevel = 12;
    
    if (pickupCoords && destCoords) {
      centerLat = (pickupCoords[0] + destCoords[0]) / 2;
      centerLng = (pickupCoords[1] + destCoords[1]) / 2;
      zoomLevel = 11;
    } else if (pickupCoords) {
      centerLat = pickupCoords[0];
      centerLng = pickupCoords[1];
      zoomLevel = 13;
    } else if (destCoords) {
      centerLat = destCoords[0];
      centerLng = destCoords[1];
      zoomLevel = 13;
    }
    
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${centerLng-0.05},${centerLat-0.05},${centerLng+0.05},${centerLat+0.05}&layer=mapnik&marker=${centerLat},${centerLng}`;
    
    return (
      <div className="relative w-full h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden border-2 border-green-200">
        {/* OpenStreetMap iframe */}
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={mapUrl}
          className="rounded-lg"
          title="OpenStreetMap"
        />
        
        {/* Overlay with markers and route info */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Pickup marker */}
          {pickup && pickupCoords && (
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-none"
              style={{
                left: '30%',
                top: '70%'
              }}
            >
              <div className="flex flex-col items-center">
                <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium shadow-lg mb-1 whitespace-nowrap max-w-32 truncate">
                  📍 {pickup.length > 15 ? pickup.substring(0, 15) + '...' : pickup}
                </div>
                <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              </div>
            </div>
          )}
          
          {/* Destination marker */}
          {destination && destCoords && (
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-none"
              style={{
                left: '70%',
                top: '30%'
              }}
            >
              <div className="flex flex-col items-center">
                <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium shadow-lg mb-1 whitespace-nowrap max-w-32 truncate">
                  🎯 {destination.length > 15 ? destination.substring(0, 15) + '...' : destination}
                </div>
                <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              </div>
            </div>
          )}
          
          {/* Route line */}
          {pickup && destination && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d="M 30% 70% Q 50% 40% 70% 30%"
                stroke="#3B82F6"
                strokeWidth="3"
                fill="none"
                strokeDasharray="8,4"
                className="animate-pulse"
              />
            </svg>
          )}
          
          {/* Driver markers */}
          <div className="absolute w-3 h-3 bg-blue-500 rounded-full border border-white shadow animate-bounce" style={{ left: '25%', top: '60%' }}>
            <Car className="w-2 h-2 text-white" />
          </div>
          <div className="absolute w-3 h-3 bg-blue-500 rounded-full border border-white shadow animate-bounce" style={{ left: '75%', top: '50%', animationDelay: '0.5s' }}>
            <Car className="w-2 h-2 text-white" />
          </div>
          <div className="absolute w-3 h-3 bg-blue-500 rounded-full border border-white shadow animate-bounce" style={{ left: '45%', top: '80%', animationDelay: '1s' }}>
            <Car className="w-2 h-2 text-white" />
          </div>
        </div>
        
        {/* Map info overlay */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-2 text-sm">
            <Map className="h-4 w-4 text-green-600" />
            <span className="font-medium">OpenStreetMap</span>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            🚗 3 drivers nearby
          </div>
        </div>
      </div>
    );
  };

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
      
      {/* Route line */}
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
      
      {/* Pickup marker */}
      {pickup && (
        <div className="absolute top-20 left-20 flex flex-col items-center">
          <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium shadow-lg mb-1">
            📍 {pickup.substring(0, 20)}
          </div>
          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
        </div>
      )}
      
      {/* Destination marker */}
      {destination && (
        <div className="absolute bottom-20 right-20 flex flex-col items-center">
          <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium shadow-lg mb-1">
            🎯 {destination.substring(0, 20)}
          </div>
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
        </div>
      )}
      
      {/* Driver markers */}
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
          🚗 3 drivers nearby
        </div>
      </div>
    </div>
  );

  if (showTokenInput && !mapboxToken && !useOpenStreetMap) {
    return (
      <Card className="p-6 border-0 shadow-lg">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold">🗺️ Map Integration</h3>
          <p className="text-sm text-gray-600">
            Choose your preferred map service for live tracking and navigation.
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
                🗺️ Use Mapbox
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setUseOpenStreetMap(true);
                  setShowTokenInput(false);
                }}
                className="flex-1"
              >
                🌍 Use OpenStreetMap (Free)
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            🌍 OpenStreetMap is free to use. Get Mapbox token at{' '}
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
      {useOpenStreetMap ? renderOpenStreetMap() : renderMockMap()}
      
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">
              {useOpenStreetMap ? '🌍 OpenStreetMap Active' : '🗺️ Live Tracking Active'}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowTokenInput(true)}
          >
            🔄 Switch Map
          </Button>
        </div>
        
        {pickup && destination && (
          <div className="mt-3 text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>📏 Distance:</span>
              <span className="font-medium">~{(Math.random() * 15 + 2).toFixed(1)} km</span>
            </div>
            <div className="flex justify-between">
              <span>⏱️ Duration:</span>
              <span className="font-medium">~{Math.floor(Math.random() * 20 + 10)} mins</span>
            </div>
            <div className="flex justify-between">
              <span>🚗 Drivers nearby:</span>
              <span className="font-medium text-green-600">3 available</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MapComponent;
