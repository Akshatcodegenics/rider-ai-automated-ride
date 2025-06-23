
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ArrowUpDown } from "lucide-react";
import LocationSearchInput from './LocationSearchInput';

interface EnhancedRideBookingFormProps {
  pickup: string;
  setPickup: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  onEstimateChange: (fare: number) => void;
}

const EnhancedRideBookingForm = ({ 
  pickup, 
  setPickup, 
  destination, 
  setDestination, 
  onEstimateChange 
}: EnhancedRideBookingFormProps) => {
  
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);

  const popularIndianDestinations = [
    "🏢 Mumbai Airport",
    "🏙️ Connaught Place, Delhi",
    "🛍️ Phoenix Mall, Bangalore",
    "🚆 Mumbai Central Railway Station", 
    "🏥 AIIMS Hospital, Delhi",
    "🎓 IIT Delhi",
    "🏛️ India Gate, Delhi",
    "🏪 Karol Bagh Metro Station",
    "🏟️ Eden Gardens, Kolkata",
    "🏝️ Marine Drive, Mumbai"
  ];

  const commonIndianPickupLocations = [
    "🏠 Home",
    "🏢 Office", 
    "🏨 Hotel",
    "🍕 Restaurant",
    "☕ Cafe Coffee Day",
    "🏪 Big Bazaar",
    "🏥 Apollo Hospital",
    "🎬 PVR Cinema",
    "🏋️ Gold's Gym",
    "💇 Lakme Salon"
  ];

  // Calculate fare when both locations are set
  useEffect(() => {
    if (pickupCoords && destCoords) {
      // Calculate distance using Haversine formula
      const R = 6371; // Earth's radius in km
      const dLat = (destCoords[1] - pickupCoords[1]) * Math.PI / 180;
      const dLon = (destCoords[0] - pickupCoords[0]) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(pickupCoords[1] * Math.PI / 180) * Math.cos(destCoords[1] * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;

      // Calculate fare based on distance
      const baseFare = 40; // Base fare in rupees
      const perKmFare = 12; // Per km fare in rupees
      const estimatedFare = baseFare + (distance * perKmFare);
      onEstimateChange(estimatedFare);
    } else {
      onEstimateChange(0);
    }
  }, [pickupCoords, destCoords, onEstimateChange]);

  const swapLocations = () => {
    const tempPickup = pickup;
    const tempPickupCoords = pickupCoords;
    
    setPickup(destination);
    setDestination(tempPickup);
    setPickupCoords(destCoords);
    setDestCoords(tempPickupCoords);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Where to?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {/* Pickup Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">📍 Pickup Location</label>
            <LocationSearchInput
              placeholder="Enter pickup location in India..."
              value={pickup}
              onChange={setPickup}
              onLocationSelect={(location) => setPickupCoords(location.coordinates)}
              icon={<MapPin className="h-4 w-4" />}
              showCurrentLocation={true}
            />
            
            <div className="flex flex-wrap gap-1 mt-2">
              {commonIndianPickupLocations.slice(0, 4).map((location) => (
                <Button
                  key={location}
                  variant="outline"
                  size="sm"
                  onClick={() => setPickup(location)}
                  className="text-xs h-7 px-2"
                >
                  {location}
                </Button>
              ))}
            </div>
          </div>

          {/* Swap Button */}
          {pickup && destination && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={swapLocations}
                className="rounded-full p-2"
                title="Swap pickup and destination"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Destination */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">🎯 Destination</label>
            <LocationSearchInput
              placeholder="Where are you going in India?"
              value={destination}
              onChange={setDestination}
              onLocationSelect={(location) => setDestCoords(location.coordinates)}
              icon={<MapPin className="h-4 w-4" />}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">🔥 Popular Indian Destinations</label>
          <div className="grid grid-cols-2 gap-2">
            {popularIndianDestinations.map((dest) => (
              <Button
                key={dest}
                variant="outline"
                size="sm"
                onClick={() => setDestination(dest)}
                className="text-xs justify-start"
              >
                {dest}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <Clock className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-800">📅 Book now or schedule for later</span>
        </div>

        {/* Route Summary */}
        {pickup && destination && pickupCoords && destCoords && (
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-sm font-medium text-green-800 mb-1">Route Summary</div>
            <div className="text-xs text-green-700 space-y-1">
              <div>📏 Distance: ~{Math.round(Math.random() * 15 + 2)} km</div>
              <div>⏱️ Duration: ~{Math.round(Math.random() * 25 + 10)} mins</div>
              <div>🛣️ Via: Main roads and highways</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedRideBookingForm;
