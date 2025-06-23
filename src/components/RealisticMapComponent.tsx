
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import * as turf from '@turf/turf';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Car, Users } from "lucide-react";

interface RealisticMapComponentProps {
  pickup: string;
  destination: string;
  onLocationSelect?: (location: { name: string; coordinates: [number, number] }) => void;
}

interface Driver {
  id: string;
  name: string;
  vehicleType: 'bike' | 'auto' | 'taxi';
  location: [number, number];
  isAvailable: boolean;
  rating: number;
  eta: number;
}

const RealisticMapComponent = ({ pickup, destination, onLocationSelect }: RealisticMapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearbyDrivers, setNearbyDrivers] = useState<Driver[]>([]);
  const [pickupMarker, setPickupMarker] = useState<maplibregl.Marker | null>(null);
  const [destinationMarker, setDestinationMarker] = useState<maplibregl.Marker | null>(null);
  const [userMarker, setUserMarker] = useState<maplibregl.Marker | null>(null);
  const [driverMarkers, setDriverMarkers] = useState<maplibregl.Marker[]>([]);

  // Indian cities with coordinates for realistic simulation
  const indianCities = [
    { name: 'New Delhi', coordinates: [77.2090, 28.6139] as [number, number] },
    { name: 'Mumbai', coordinates: [72.8777, 19.0760] as [number, number] },
    { name: 'Bangalore', coordinates: [77.5946, 12.9716] as [number, number] },
    { name: 'Chennai', coordinates: [80.2707, 13.0827] as [number, number] },
    { name: 'Hyderabad', coordinates: [78.4867, 17.3850] as [number, number] },
    { name: 'Kolkata', coordinates: [88.3639, 22.5726] as [number, number] }
  ];

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Get user's current location or default to Delhi
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc: [number, number] = [position.coords.longitude, position.coords.latitude];
        setUserLocation(userLoc);
        initializeMap(userLoc);
      },
      () => {
        // Default to Delhi if geolocation fails
        const defaultLoc: [number, number] = [77.2090, 28.6139];
        setUserLocation(defaultLoc);
        initializeMap(defaultLoc);
      }
    );

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const initializeMap = (center: [number, number]) => {
    map.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: ['https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm-tiles'
          }
        ]
      },
      center: center,
      zoom: 13,
      attributionControl: false
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add user location marker with ripple effect
    addUserLocationMarker(center);

    // Generate and add nearby drivers
    generateNearbyDrivers(center);

    map.current.on('load', () => {
      // Add route layer for when pickup and destination are set
      map.current!.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        }
      });

      map.current!.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 4,
          'line-dasharray': [2, 2]
        }
      });
    });
  };

  const addUserLocationMarker = (location: [number, number]) => {
    if (!map.current) return;

    // Create custom user location marker with ripple effect
    const userEl = document.createElement('div');
    userEl.className = 'user-location-marker';
    userEl.innerHTML = `
      <div class="relative">
        <div class="absolute w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-75"></div>
        <div class="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
      </div>
    `;

    const marker = new maplibregl.Marker({ element: userEl })
      .setLngLat(location)
      .addTo(map.current);

    setUserMarker(marker);
  };

  const generateNearbyDrivers = (center: [number, number]) => {
    const drivers: Driver[] = [];
    const vehicleTypes: ('bike' | 'auto' | 'taxi')[] = ['bike', 'auto', 'taxi'];
    
    for (let i = 0; i < 8; i++) {
      // Generate random location within 3km radius
      const randomAngle = Math.random() * 2 * Math.PI;
      const randomDistance = Math.random() * 0.03; // ~3km in degrees
      
      const driverLocation: [number, number] = [
        center[0] + Math.cos(randomAngle) * randomDistance,
        center[1] + Math.sin(randomAngle) * randomDistance
      ];

      drivers.push({
        id: `driver-${i}`,
        name: `Driver ${i + 1}`,
        vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
        location: driverLocation,
        isAvailable: Math.random() > 0.3,
        rating: Number((4 + Math.random()).toFixed(1)),
        eta: Math.floor(Math.random() * 10) + 2
      });
    }

    setNearbyDrivers(drivers);
    addDriverMarkers(drivers);
  };

  const addDriverMarkers = (drivers: Driver[]) => {
    if (!map.current) return;

    // Clear existing markers
    driverMarkers.forEach(marker => marker.remove());

    const newMarkers = drivers.map(driver => {
      const vehicleIcon = getVehicleIcon(driver.vehicleType);
      const availabilityColor = driver.isAvailable ? '#10b981' : '#6b7280';

      const el = document.createElement('div');
      el.className = 'driver-marker';
      el.innerHTML = `
        <div class="relative">
          <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-sm" 
               style="background-color: ${availabilityColor}">
            ${vehicleIcon}
          </div>
          <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full border border-gray-300 flex items-center justify-center">
            <div class="w-2 h-2 rounded-full ${driver.isAvailable ? 'bg-green-500' : 'bg-gray-400'}"></div>
          </div>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(driver.location)
        .addTo(map.current!);

      // Add popup with driver info
      const popup = new maplibregl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <div class="font-medium">${driver.name}</div>
            <div class="text-sm text-gray-600">${driver.vehicleType.toUpperCase()}</div>
            <div class="text-sm">⭐ ${driver.rating} • ${driver.eta} min away</div>
            <div class="text-xs ${driver.isAvailable ? 'text-green-600' : 'text-gray-500'}">
              ${driver.isAvailable ? 'Available' : 'Busy'}
            </div>
          </div>
        `);

      marker.setPopup(popup);
      return marker;
    });

    setDriverMarkers(newMarkers);

    // Simulate driver movement every 5 seconds
    setTimeout(() => simulateDriverMovement(), 5000);
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bike': return '🏍️';
      case 'auto': return '🛺';
      case 'taxi': return '🚗';
      default: return '🚗';
    }
  };

  const simulateDriverMovement = () => {
    if (!map.current) return;

    setNearbyDrivers(prev => prev.map(driver => {
      if (Math.random() > 0.7) { // 30% chance to move
        const currentLoc = driver.location;
        const moveDistance = 0.001; // Small movement
        const angle = Math.random() * 2 * Math.PI;
        
        return {
          ...driver,
          location: [
            currentLoc[0] + Math.cos(angle) * moveDistance,
            currentLoc[1] + Math.sin(angle) * moveDistance
          ] as [number, number]
        };
      }
      return driver;
    }));
  };

  // Geocode location using Nominatim
  const geocodeLocation = async (locationName: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&addressdetails=1&limit=1&countrycodes=in`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  // Update pickup and destination markers
  useEffect(() => {
    const updateMarkers = async () => {
      if (!map.current) return;

      // Update pickup marker
      if (pickup) {
        const pickupCoords = await geocodeLocation(pickup);
        if (pickupCoords) {
          if (pickupMarker) pickupMarker.remove();
          
          const pickupEl = document.createElement('div');
          pickupEl.innerHTML = `
            <div class="flex flex-col items-center">
              <div class="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium shadow-lg mb-1 whitespace-nowrap">
                📍 Pickup
              </div>
              <div class="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
            </div>
          `;
          
          const newPickupMarker = new maplibregl.Marker({ element: pickupEl })
            .setLngLat(pickupCoords)
            .addTo(map.current);
          
          setPickupMarker(newPickupMarker);
        }
      }

      // Update destination marker
      if (destination) {
        const destCoords = await geocodeLocation(destination);
        if (destCoords) {
          if (destinationMarker) destinationMarker.remove();
          
          const destEl = document.createElement('div');
          destEl.innerHTML = `
            <div class="flex flex-col items-center">
              <div class="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium shadow-lg mb-1 whitespace-nowrap">
                🎯 Drop
              </div>
              <div class="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
            </div>
          `;
          
          const newDestMarker = new maplibregl.Marker({ element: destEl })
            .setLngLat(destCoords)
            .addTo(map.current);
          
          setDestinationMarker(newDestMarker);
        }
      }

      // Draw route if both locations exist
      if (pickup && destination) {
        const pickupCoords = await geocodeLocation(pickup);
        const destCoords = await geocodeLocation(destination);
        
        if (pickupCoords && destCoords && map.current.getSource('route')) {
          // Create a curved route using turf.js
          const route = turf.greatCircle(
            turf.point(pickupCoords),
            turf.point(destCoords),
            { npoints: 100 }
          );

          (map.current.getSource('route') as maplibregl.GeoJSONSource).setData(route);
          
          // Fit map to show both points
          const bounds = new maplibregl.LngLatBounds()
            .extend(pickupCoords)
            .extend(destCoords);
          
          map.current.fitBounds(bounds, { padding: 50 });
        }
      }
    };

    updateMarkers();
  }, [pickup, destination]);

  const centerToUserLocation = () => {
    if (map.current && userLocation) {
      map.current.easeTo({
        center: userLocation,
        zoom: 15,
        duration: 1000
      });
    }
  };

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div className="relative">
        <div ref={mapContainer} className="w-full h-96" />
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={centerToUserLocation}
            className="bg-white/90 backdrop-blur-sm"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>

        {/* Driver Count Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <Car className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{nearbyDrivers.filter(d => d.isAvailable).length} drivers nearby</span>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            🇮🇳 India • Live tracking active
          </div>
        </div>

        {/* Vehicle Type Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="text-xs font-medium mb-2">Vehicle Types</div>
          <div className="flex gap-3 text-xs">
            <div className="flex items-center gap-1">
              <span>🏍️</span>
              <span>Bike</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🛺</span>
              <span>Auto</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🚗</span>
              <span>Taxi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Stats */}
      <div className="p-4 bg-white border-t">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="font-medium text-green-600">{nearbyDrivers.filter(d => d.isAvailable).length}</div>
            <div className="text-gray-600">Available</div>
          </div>
          <div>
            <div className="font-medium text-blue-600">
              {pickup && destination ? `${Math.floor(Math.random() * 15 + 5)} min` : '--'}
            </div>
            <div className="text-gray-600">ETA</div>
          </div>
          <div>
            <div className="font-medium text-purple-600">
              {pickup && destination ? `₹${Math.floor(Math.random() * 200 + 50)}` : '--'}
            </div>
            <div className="text-gray-600">Estimate</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .user-location-marker {
          cursor: pointer;
        }
        .driver-marker {
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        .driver-marker:hover {
          transform: scale(1.1);
        }
      `}</style>
    </Card>
  );
};

export default RealisticMapComponent;
