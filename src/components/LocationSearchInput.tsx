
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Loader } from "lucide-react";

interface LocationSuggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

interface LocationSearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: { name: string; coordinates: [number, number] }) => void;
  icon?: React.ReactNode;
  showCurrentLocation?: boolean;
}

const LocationSearchInput = ({
  placeholder,
  value,
  onChange,
  onLocationSelect,
  icon,
  showCurrentLocation = false
}: LocationSearchInputProps) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search function
  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    
    try {
      // Add India-specific search bias
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=in&bounded=1&viewbox=68.1766451354,7.96553477623,97.4025614766,35.4940095078`
      );
      
      const data: LocationSuggestion[] = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Location search error:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
    
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Set new timer for debounced search
    debounceTimer.current = setTimeout(() => {
      searchLocations(inputValue);
    }, 300);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: LocationSuggestion) => {
    const locationName = formatLocationName(suggestion);
    onChange(locationName);
    setShowSuggestions(false);
    
    if (onLocationSelect) {
      onLocationSelect({
        name: locationName,
        coordinates: [parseFloat(suggestion.lon), parseFloat(suggestion.lat)]
      });
    }
  };

  // Format location name for display
  const formatLocationName = (suggestion: LocationSuggestion) => {
    const parts = [];
    
    if (suggestion.address.city) parts.push(suggestion.address.city);
    if (suggestion.address.state) parts.push(suggestion.address.state);
    
    return parts.length > 0 ? parts.join(', ') : suggestion.display_name.split(',')[0];
  };

  // Get current location
  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding to get address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
            );
            
            const data = await response.json();
            const locationName = data.address.city || data.address.town || data.address.village || 'Current Location';
            
            onChange(`📍 ${locationName}`);
            
            if (onLocationSelect) {
              onLocationSelect({
                name: `📍 ${locationName}`,
                coordinates: [longitude, latitude]
              });
            }
          } catch (error) {
            console.error('Reverse geocoding error:', error);
            onChange(`📍 Current Location`);
          } finally {
            setIsGettingLocation(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert('Unable to get your location. Please enable location permissions.');
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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={inputRef}>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <div className="relative">
            {icon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {icon}
              </div>
            )}
            <Input
              placeholder={placeholder}
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => value.length >= 2 && setShowSuggestions(true)}
              className={`${icon ? 'pl-10' : ''} pr-10`}
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {formatLocationName(suggestion)}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {suggestion.display_name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {showCurrentLocation && (
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
        )}
      </div>
    </div>
  );
};

export default LocationSearchInput;
