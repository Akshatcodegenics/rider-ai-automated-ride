
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock, Loader } from "lucide-react";

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
  
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  const popularIndianDestinations = [
    "🏢 Mumbai Airport",
    "🏙️ Connaught Place, Delhi",
    "🛍️ Phoenix Mall, Bangalore",
    "🚆 Mumbai Central Railway Station", 
    "🏥 AIIMS Hospital",
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

  // Indian cities and landmarks for better suggestions
  const getIndianLocationSuggestions = (input: string) => {
    if (!input.trim()) return [];
    
    const indianLocations = [
      `${input} - New Delhi`,
      `${input} - Mumbai, Maharashtra`,
      `${input} - Bangalore, Karnataka`,
      `${input} - Hyderabad, Telangana`,
      `${input} - Chennai, Tamil Nadu`,
      `${input} - Kolkata, West Bengal`,
      `${input} - Pune, Maharashtra`,
      `${input} - Ahmedabad, Gujarat`
    ];
    
    return indianLocations.slice(0, 3);
  };

  const handlePickupChange = (value: string) => {
    setPickup(value);
    if (value.length > 2) {
      setPickupSuggestions(getIndianLocationSuggestions(value));
      setShowPickupSuggestions(true);
    } else {
      setShowPickupSuggestions(false);
    }
  };

  const handleDestinationChange = (value: string) => {
    setDestination(value);
    if (value.length > 2) {
      setDestinationSuggestions(getIndianLocationSuggestions(value));
      setShowDestinationSuggestions(true);
    } else {
      setShowDestinationSuggestions(false);
    }
  };

  // Mock fare calculation in rupees
  useEffect(() => {
    if (pickup && destination) {
      const baseFare = 40; // Base fare in rupees
      const perKmFare = 12; // Per km fare in rupees
      const mockDistance = Math.random() * 20 + 2; // 2-22 km
      const estimatedFare = baseFare + (mockDistance * perKmFare);
      onEstimateChange(estimatedFare);
    } else {
      onEstimateChange(0);
    }
  }, [pickup, destination, onEstimateChange]);

  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Current location:', latitude, longitude);
          
          // Mock reverse geocoding for Indian location
          setPickup(`📍 Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert('Unable to get your location. Please enable location permissions or enter manually.');
          setIsGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setIsGettingLocation(false);
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
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-gray-700">📍 Pickup Location</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Enter pickup location in India..."
                value={pickup}
                onChange={(e) => handlePickupChange(e.target.value)}
                onFocus={() => pickup.length > 2 && setShowPickupSuggestions(true)}
                onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
                className="pr-4"
              />
              
              {showPickupSuggestions && pickupSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-10 mt-1">
                  {pickupSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setPickup(suggestion);
                        setShowPickupSuggestions(false);
                      }}
                    >
                      📍 {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleGetCurrentLocation}
              disabled={isGettingLocation}
              className="px-3"
              title="Use current location"
            >
              {isGettingLocation ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
            </Button>
          </div>
          
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

        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-gray-700">🎯 Destination</label>
          <div className="relative">
            <Input
              placeholder="Where are you going in India?"
              value={destination}
              onChange={(e) => handleDestinationChange(e.target.value)}
              onFocus={() => destination.length > 2 && setShowDestinationSuggestions(true)}
              onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
            />
            
            {showDestinationSuggestions && destinationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-10 mt-1">
                {destinationSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      setDestination(suggestion);
                      setShowDestinationSuggestions(false);
                    }}
                  >
                    🎯 {suggestion}
                  </div>
                ))}
              </div>
            )}
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
      </CardContent>
    </Card>
  );
};

export default RideBookingForm;
