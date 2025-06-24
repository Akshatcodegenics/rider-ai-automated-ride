
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock } from "lucide-react";
import LocationAutocomplete from './LocationAutocomplete';

interface RideBookingFormProps {
  pickup: string;
  setPickup: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  onEstimateChange: (fare: number) => void;
}

const RideBookingForm = ({ 
  pickup, 
  setPickup, 
  destination, 
  setDestination, 
  onEstimateChange 
}: RideBookingFormProps) => {

  // Calculate fare in rupees when locations change
  useEffect(() => {
    if (pickup && destination) {
      const baseFare = 40; // Base fare in rupees
      const perKmFare = 12; // Per km fare in rupees
      const mockDistance = Math.random() * 20 + 2; // 2-22 km simulation
      const estimatedFare = baseFare + (mockDistance * perKmFare);
      onEstimateChange(estimatedFare);
    } else {
      onEstimateChange(0);
    }
  }, [pickup, destination, onEstimateChange]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Where to?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <LocationAutocomplete
          value={pickup}
          onChange={setPickup}
          placeholder="Enter pickup location in India..."
          label="📍 Pickup Location"
          icon={<div className="w-3 h-3 bg-green-500 rounded-full"></div>}
        />

        <LocationAutocomplete
          value={destination}
          onChange={setDestination}
          placeholder="Where are you going in India?"
          label="🎯 Destination"
          icon={<div className="w-3 h-3 bg-red-500 rounded-full"></div>}
        />

        <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <Clock className="h-5 w-5 text-blue-600" />
          <div>
            <div className="text-sm font-medium text-blue-900">Book Now or Schedule Later</div>
            <div className="text-xs text-blue-700">Instant booking • Advanced scheduling available</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideBookingForm;
