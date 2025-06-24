
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock, Loader, Search } from "lucide-react";

interface LocationResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  icon?: React.ReactNode;
  onLocationSelect?: (location: LocationResult) => void;
  className?: string;
}

const LocationAutocomplete = ({ 
  value, 
  onChange, 
  placeholder, 
  label, 
  icon,
  onLocationSelect,
  className = ""
}: LocationAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Enhanced popular Indian locations
  const popularLocations = [
    "Mumbai Airport, Mumbai",
    "Connaught Place, New Delhi",
    "Bangalore Airport, Bangalore", 
    "Chennai Central, Chennai",
    "Hyderabad Airport, Hyderabad",
    "Kolkata Airport, Kolkata",
    "India Gate, New Delhi",
    "Gateway of India, Mumbai",
    "Marina Beach, Chennai",
    "Charminar, Hyderabad"
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentLocationSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (value.length >= 2) {
      // Clear previous timeout
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Set new timeout for API call (200ms delay for better real-time feel)
      debounceRef.current = setTimeout(() => {
        searchLocations(value);
      }, 200);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value]);

  const searchLocations = async (query: string) => {
    if (query.length < 2) return;

    setIsLoading(true);
    try {
      // Enhanced search with better parameters
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` + 
        `q=${encodeURIComponent(query + ' India')}&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=8&` +
        `countrycodes=in&` +
        `dedupe=1`
      );
      
      if (response.ok) {
        const data: LocationResult[] = await response.json();
        
        // Filter and sort results for better relevance
        const filteredData = data
          .filter(item => item.importance > 0.3)
          .sort((a, b) => b.importance - a.importance);
          
        setSuggestions(filteredData);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Location search error:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: LocationResult) => {
    const selectedLocation = suggestion.display_name;
    onChange(selectedLocation);
    setShowSuggestions(false);
    onLocationSelect?.(suggestion);
    
    // Save to recent searches
    const updatedRecent = [selectedLocation, ...recentSearches.filter(item => item !== selectedLocation)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentLocationSearches', JSON.stringify(updatedRecent));
  };

  const handleCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding to get address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?` +
              `lat=${latitude}&` +
              `lon=${longitude}&` +
              `format=json&` +
              `addressdetails=1&` +
              `zoom=16`
            );
            
            if (response.ok) {
              const data = await response.json();
              const address = data.display_name || `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
              onChange(address);
              onLocationSelect?.({
                place_id: 'current',
                display_name: address,
                lat: latitude.toString(),
                lon: longitude.toString(),
                type: 'current_location',
                importance: 1
              });
            }
          } catch (error) {
            console.error('Reverse geocoding error:', error);
            onChange(`📍 Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          }
          
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert('Unable to get your location. Please enable location permissions and try again.');
          setIsGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setIsGettingLocation(false);
    }
  };

  const handleFocus = () => {
    if (suggestions.length > 0 || value.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding to allow click on suggestions
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const formatLocationName = (displayName: string) => {
    const parts = displayName.split(',');
    return {
      primary: parts[0],
      secondary: parts.slice(1, 3).join(',').trim()
    };
  };

  return (
    <div className={`space-y-2 relative ${className}`}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {icon}
        {label}
      </label>
      
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <div className="relative">
            <Input
              ref={inputRef}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="pr-20 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            
            {isLoading && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                <Loader className="h-4 w-4 animate-spin text-blue-500" />
              </div>
            )}
          </div>
          
          {showSuggestions && (suggestions.length > 0 || (!value && recentSearches.length > 0)) && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-80 overflow-y-auto">
              
              {/* Recent searches */}
              {!value && recentSearches.length > 0 && (
                <>
                  <div className="px-3 py-2 bg-gray-50 border-b text-xs font-medium text-gray-600">
                    <Clock className="inline h-3 w-3 mr-1" />
                    Recent Searches
                  </div>
                  {recentSearches.map((recent, index) => {
                    const formatted = formatLocationName(recent);
                    return (
                      <div
                        key={`recent-${index}`}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        onClick={() => handleSuggestionClick({
                          place_id: `recent-${index}`,
                          display_name: recent,
                          lat: '0',
                          lon: '0',
                          type: 'recent',
                          importance: 1
                        })}
                      >
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {formatted.primary}
                            </div>
                            {formatted.secondary && (
                              <div className="text-xs text-gray-600 truncate">
                                {formatted.secondary}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* Current suggestions */}
              {suggestions.length > 0 && (
                <>
                  {!value && <div className="border-t border-gray-200" />}
                  {suggestions.map((suggestion) => {
                    const formatted = formatLocationName(suggestion.display_name);
                    return (
                      <div
                        key={suggestion.place_id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {formatted.primary}
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                              {formatted.secondary}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleCurrentLocation}
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
      
      {/* Popular locations quick select for empty input */}
      {!value && !showSuggestions && (
        <div className="space-y-2">
          <div className="text-xs text-gray-500 font-medium">Popular destinations:</div>
          <div className="flex flex-wrap gap-1">
            {popularLocations.slice(0, 4).map((location) => (
              <Button
                key={location}
                variant="outline"
                size="sm"
                onClick={() => onChange(location)}
                className="text-xs h-7 px-2 text-gray-600 hover:text-gray-900 hover:border-blue-300"
              >
                {location.split(',')[0]}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
