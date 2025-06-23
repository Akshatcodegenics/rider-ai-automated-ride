
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Map, Car } from "lucide-react";

interface MapComponentProps {
  pickup: string;
  destination: string;
}

const MapComponent = ({ pickup, destination }: MapComponentProps) => {
  const [useOpenStreetMap, setUseOpenStreetMap] = useState(true);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  // Indian coordinates for major cities
  const getIndianCoordinates = (location: string): [number, number] => {
    const indianLocations: { [key: string]: [number, number] } = {
      'current location': [28.6139, 77.2090], // Delhi
      'mumbai airport': [19.0896, 72.8656],
      'connaught place': [28.6315, 77.2167],
      'phoenix mall': [12.9279, 77.6271],
      'mumbai central': [18.9690, 72.8205],
      'aiims hospital': [28.5672, 77.2100],
      'iit delhi': [28.5458, 77.1918],
      'india gate': [28.6129, 77.2295],
      'karol bagh': [28.6516, 77.1929],
      'eden gardens': [22.5647, 88.3433],
      'marine drive': [18.9441, 72.8231],
      'bangalore': [12.9716, 77.5946],
      'hyderabad': [17.3850, 78.4867],
      'chennai': [13.0827, 80.2707],
      'kolkata': [22.5726, 88.3639],
      'pune': [18.5204, 73.8567],
      'ahmedabad': [23.0225, 72.5714],
      'delhi': [28.6139, 77.2090]
    };
    
    const cleanLocation = location.toLowerCase()
      .replace(/📍|🎯|🏢|🏙️|🛍️|🚆|🏥|🎓|🏛️|🏪|🏟️|🏝️|🏠|🍕|☕|🎬|🏋️|💇/g, '')
      .replace(/\s*-\s*.*/g, '')
      .replace(/\(.*\)/g, '')
      .trim();
    
    for (const [key, coords] of Object.entries(indianLocations)) {
      if (cleanLocation.includes(key) || key.includes(cleanLocation)) {
        return coords;
      }
    }
    
    // Default to Delhi with some random offset
    return [28.6139 + (Math.random() - 0.5) * 0.1, 77.2090 + (Math.random() - 0.5) * 0.1];
  };

  const renderIndianMap = () => {
    const pickupCoords = pickup ? getIndianCoordinates(pickup) : null;
    const destCoords = destination ? getIndianCoordinates(destination) : null;
    
    let centerLat = 28.6139; // Delhi
    let centerLng = 77.2090;
    let zoomLevel = 10;
    
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
      <div className="relative w-full h-96 bg-gradient-to-br from-orange-100 to-green-100 rounded-lg overflow-hidden border-2 border-orange-200">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={mapUrl}
          className="rounded-lg"
          title="India Map"
        />
        
        <div className="absolute inset-0 pointer-events-none">
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
          
          {pickup && destination && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d="M 30% 70% Q 50% 40% 70% 30%"
                stroke="#FF6B35"
                strokeWidth="3"
                fill="none"
                strokeDasharray="8,4"
                className="animate-pulse"
              />
            </svg>
          )}
          
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
        
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-orange-600">🇮🇳</span>
            <span className="font-medium">India Map</span>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            🚗 5 drivers nearby
          </div>
        </div>
      </div>
    );
  };

  if (showTokenInput && !mapboxToken && !useOpenStreetMap) {
    return (
      <Card className="p-6 border-0 shadow-lg">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold">🗺️ Map Integration</h3>
          <p className="text-sm text-gray-600">
            Choose your preferred map service for live tracking and navigation in India.
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
                🇮🇳 Use India Map (Free)
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      {renderIndianMap()}
      
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">
              🇮🇳 India Live Tracking Active
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
              <span className="font-medium text-green-600">5 available</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MapComponent;
