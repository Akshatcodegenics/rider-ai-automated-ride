
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Home, Briefcase, MapPin, Plus, Star, Clock, Edit, Trash2 } from "lucide-react";

interface SavedLocation {
  id: string;
  name: string;
  address: string;
  type: 'home' | 'work' | 'favorite' | 'custom';
  icon: string;
  lastUsed: Date;
  usageCount: number;
}

interface SavedLocationsProps {
  onLocationSelect: (address: string) => void;
  currentLocation?: string;
}

const SavedLocations = ({ onLocationSelect, currentLocation }: SavedLocationsProps) => {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: '', address: '', type: 'custom' as const });

  useEffect(() => {
    loadSavedLocations();
  }, []);

  const loadSavedLocations = () => {
    const saved = localStorage.getItem('savedLocations');
    if (saved) {
      const locations = JSON.parse(saved);
      setSavedLocations(locations.map((loc: any) => ({
        ...loc,
        lastUsed: new Date(loc.lastUsed)
      })));
    } else {
      // Default locations
      const defaultLocations: SavedLocation[] = [
        {
          id: 'home',
          name: 'Home',
          address: 'Add your home address',
          type: 'home',
          icon: '🏠',
          lastUsed: new Date(),
          usageCount: 0
        },
        {
          id: 'work',
          name: 'Work',
          address: 'Add your work address',
          type: 'work',
          icon: '🏢',
          lastUsed: new Date(),
          usageCount: 0
        }
      ];
      setSavedLocations(defaultLocations);
    }
  };

  const saveLoc = (locations: SavedLocation[]) => {
    localStorage.setItem('savedLocations', JSON.stringify(locations));
    setSavedLocations(locations);
  };

  const addLocation = () => {
    if (newLocation.name && newLocation.address) {
      const location: SavedLocation = {
        id: Date.now().toString(),
        name: newLocation.name,
        address: newLocation.address,
        type: newLocation.type,
        icon: getLocationIcon(newLocation.type),
        lastUsed: new Date(),
        usageCount: 0
      };
      
      const updated = [...savedLocations, location];
      saveLoc(updated);
      setNewLocation({ name: '', address: '', type: 'custom' });
      setIsAdding(false);
    }
  };

  const updateLocation = (id: string, updates: Partial<SavedLocation>) => {
    const updated = savedLocations.map(loc => 
      loc.id === id ? { ...loc, ...updates } : loc
    );
    saveLoc(updated);
  };

  const deleteLocation = (id: string) => {
    const updated = savedLocations.filter(loc => loc.id !== id);
    saveLoc(updated);
  };

  const handleLocationSelect = (location: SavedLocation) => {
    if (location.address && location.address !== 'Add your home address' && location.address !== 'Add your work address') {
      updateLocation(location.id, {
        lastUsed: new Date(),
        usageCount: location.usageCount + 1
      });
      onLocationSelect(location.address);
    }
  };

  const getLocationIcon = (type: SavedLocation['type']) => {
    switch (type) {
      case 'home': return '🏠';
      case 'work': return '🏢';
      case 'favorite': return '⭐';
      default: return '📍';
    }
  };

  const getRecentLocations = () => {
    const recent = localStorage.getItem('recentLocationSearches');
    return recent ? JSON.parse(recent).slice(0, 3) : [];
  };

  const frequentLocations = [...savedLocations]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 3);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Quick Access
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAdding(!isAdding)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new location form */}
        {isAdding && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <Input
              placeholder="Location name (e.g., Mom's House)"
              value={newLocation.name}
              onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Full address"
              value={newLocation.address}
              onChange={(e) => setNewLocation(prev => ({ ...prev, address: e.target.value }))}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={addLocation}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Saved locations */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Saved Places</h4>
          {savedLocations.map(location => (
            <div
              key={location.id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer group transition-colors"
              onClick={() => handleLocationSelect(location)}
            >
              <div className="text-xl">{location.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{location.name}</div>
                <div className="text-xs text-gray-600 truncate">
                  {location.address}
                </div>
                {location.usageCount > 0 && (
                  <div className="text-xs text-gray-500">
                    Used {location.usageCount} times
                  </div>
                )}
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLocation(location.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Frequent locations */}
        {frequentLocations.some(loc => loc.usageCount > 0) && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Star className="h-4 w-4" />
              Most Used
            </h4>
            {frequentLocations
              .filter(loc => loc.usageCount > 0)
              .map(location => (
                <Button
                  key={location.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleLocationSelect(location)}
                >
                  <span className="mr-2">{location.icon}</span>
                  {location.name}
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {location.usageCount}
                  </Badge>
                </Button>
              ))}
          </div>
        )}

        {/* Recent searches */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Recent
          </h4>
          {getRecentLocations().slice(0, 2).map((recent: string, index: number) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => onLocationSelect(recent)}
            >
              <Clock className="h-3 w-3 mr-2 text-gray-400" />
              <span className="truncate">{recent}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedLocations;
