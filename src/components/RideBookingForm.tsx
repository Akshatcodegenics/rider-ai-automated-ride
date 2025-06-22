
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock } from "lucide-react";

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
  
  const popularDestinations = [
    "Airport",
    "Downtown",
    "Mall",
    "Train Station",
    "Hospital",
    "University"
  ];

  // Mock fare calculation
  useEffect(() => {
    if (pickup && destination) {
      // Simple mock calculation - in real app, this would call a pricing API
      const baseFare = 5;
      const perMileFare = 2.5;
      const mockDistance = Math.random() * 20 + 2; // 2-22 miles
      const estimatedFare = baseFare + (mockDistance * perMileFare);
      onEstimateChange(estimatedFare);
    } else {
      onEstimateChange(0);
    }
  }, [pickup, destination, onEstimateChange]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          setPickup("Current Location");
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
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
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Pickup Location</label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter pickup location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleGetCurrentLocation}
              className="px-3"
            >
              <Navigation className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Destination</label>
          <Input
            placeholder="Where are you going?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Popular Destinations</label>
          <div className="grid grid-cols-2 gap-2">
            {popularDestinations.map((dest) => (
              <Button
                key={dest}
                variant="outline"
                size="sm"
                onClick={() => setDestination(dest)}
                className="text-xs"
              >
                {dest}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <Clock className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-800">Book now or schedule for later</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideBookingForm;
