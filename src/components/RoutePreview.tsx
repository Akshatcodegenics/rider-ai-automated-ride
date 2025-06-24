
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Route, Clock, DollarSign, Zap, Leaf, AlertTriangle } from "lucide-react";

interface RouteOption {
  id: string;
  name: string;
  distance: string;
  duration: string;
  fare: number;
  type: 'fastest' | 'shortest' | 'cheapest' | 'eco';
  tollCost: number;
  trafficLevel: 'low' | 'medium' | 'high';
  carbonFootprint: number;
  highlights: string[];
}

interface RoutePreviewProps {
  pickup: string;
  destination: string;
  onRouteSelect: (route: RouteOption) => void;
}

const RoutePreview = ({ pickup, destination, onRouteSelect }: RoutePreviewProps) => {
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [weatherCondition, setWeatherCondition] = useState<'clear' | 'rain' | 'fog'>('clear');

  useEffect(() => {
    if (pickup && destination) {
      generateRouteOptions();
      simulateWeatherCondition();
    }
  }, [pickup, destination]);

  const generateRouteOptions = () => {
    const baseDistance = Math.random() * 20 + 5; // 5-25 km
    const baseFare = 40 + (baseDistance * 12);

    const routeOptions: RouteOption[] = [
      {
        id: 'fastest',
        name: 'Fastest Route',
        distance: `${baseDistance.toFixed(1)} km`,
        duration: `${Math.floor(baseDistance * 2.5)} min`,
        fare: baseFare * 1.2,
        type: 'fastest',
        tollCost: Math.floor(Math.random() * 50) + 20,
        trafficLevel: 'medium',
        carbonFootprint: baseDistance * 0.12,
        highlights: ['Express lanes', 'Minimal stops']
      },
      {
        id: 'shortest',
        name: 'Shortest Route',
        distance: `${(baseDistance * 0.8).toFixed(1)} km`,
        duration: `${Math.floor(baseDistance * 3)} min`,
        fare: baseFare * 0.9,
        type: 'shortest',
        tollCost: 0,
        trafficLevel: 'high',
        carbonFootprint: baseDistance * 0.08,
        highlights: ['No tolls', 'City roads']
      },
      {
        id: 'cheapest',
        name: 'Most Economical',
        distance: `${(baseDistance * 1.1).toFixed(1)} km`,
        duration: `${Math.floor(baseDistance * 3.5)} min`,
        fare: baseFare * 0.75,
        type: 'cheapest',
        tollCost: 0,
        trafficLevel: 'low',
        carbonFootprint: baseDistance * 0.09,
        highlights: ['Avoid tolls', 'Budget friendly']
      },
      {
        id: 'eco',
        name: 'Eco-Friendly Route',
        distance: `${(baseDistance * 0.95).toFixed(1)} km`,
        duration: `${Math.floor(baseDistance * 2.8)} min`,
        fare: baseFare * 1.05,
        type: 'eco',
        tollCost: Math.floor(Math.random() * 30) + 10,
        trafficLevel: 'low',
        carbonFootprint: baseDistance * 0.06,
        highlights: ['Low emissions', 'Green corridors', 'Less traffic']
      }
    ];

    setRoutes(routeOptions);
    setSelectedRoute(routeOptions[0]);
  };

  const simulateWeatherCondition = () => {
    const conditions: ('clear' | 'rain' | 'fog')[] = ['clear', 'rain', 'fog'];
    setWeatherCondition(conditions[Math.floor(Math.random() * conditions.length)]);
  };

  const getRouteIcon = (type: RouteOption['type']) => {
    switch (type) {
      case 'fastest': return <Zap className="h-4 w-4 text-blue-600" />;
      case 'shortest': return <Route className="h-4 w-4 text-green-600" />;
      case 'cheapest': return <DollarSign className="h-4 w-4 text-yellow-600" />;
      case 'eco': return <Leaf className="h-4 w-4 text-green-700" />;
    }
  };

  const getTrafficColor = (level: RouteOption['trafficLevel']) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
    }
  };

  const getWeatherWarning = () => {
    switch (weatherCondition) {
      case 'rain':
        return { icon: '🌧️', message: 'Rainy conditions - expect delays', color: 'text-blue-600' };
      case 'fog':
        return { icon: '🌫️', message: 'Foggy weather - drive carefully', color: 'text-gray-600' };
      default:
        return null;
    }
  };

  const weatherWarning = getWeatherWarning();

  if (!pickup || !destination) {
    return null;
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5 text-blue-600" />
          Route Options
        </CardTitle>
        {weatherWarning && (
          <div className={`flex items-center gap-2 text-sm ${weatherWarning.color} bg-blue-50 p-2 rounded-lg`}>
            <span>{weatherWarning.icon}</span>
            <span>{weatherWarning.message}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {routes.map((route) => (
          <div
            key={route.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedRoute?.id === route.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => {
              setSelectedRoute(route);
              onRouteSelect(route);
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getRouteIcon(route.type)}
                <span className="font-semibold">{route.name}</span>
              </div>
              <div className="text-lg font-bold text-green-600">₹{Math.floor(route.fare)}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Route className="h-3 w-3" />
                <span>{route.distance}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{route.duration}</span>
              </div>
              <div className={`flex items-center gap-1 ${getTrafficColor(route.trafficLevel)}`}>
                <AlertTriangle className="h-3 w-3" />
                <span className="capitalize">{route.trafficLevel} traffic</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex gap-2">
                {route.tollCost > 0 && (
                  <Badge variant="outline" className="text-xs">
                    Toll: ₹{route.tollCost}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs text-green-600">
                  {route.carbonFootprint.toFixed(2)}kg CO₂
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {route.highlights.map((highlight, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>
        ))}

        {selectedRoute && (
          <Button 
            className="w-full mt-4" 
            onClick={() => onRouteSelect(selectedRoute)}
          >
            Select {selectedRoute.name} - ₹{Math.floor(selectedRoute.fare)}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RoutePreview;
