import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import * as turf from '@turf/turf';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapStyles.css';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation, Car, MapPin, AlertTriangle } from "lucide-react";

interface RealisticMapComponentProps {
  pickup?: string;
  destination?: string;
  onLocationSelect?: (location: { pickup?: string; destination?: string }) => void;
}

const RealisticMapComponent = ({ pickup, destination, onLocationSelect }: RealisticMapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearbyDrivers, setNearbyDrivers] = useState<any[]>([]);
  const [pickupMarker, setPickupMarker] = useState<maplibregl.Marker | null>(null);
  const [destinationMarker, setDestinationMarker] = useState<maplibregl.Marker | null>(null);
  const [userMarker, setUserMarker] = useState<maplibregl.Marker | null>(null);
  const [driverMarkers, setDriverMarkers] = useState<maplibregl.Marker[]>([]);
  const [routeData, setRouteData] = useState<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize map with better error handling
  useEffect(() => {
    if (!mapContainer.current) return;

    // Get user's current location or default to Delhi
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc: [number, number] = [position.coords.longitude, position.coords.latitude];
        setUserLocation(userLoc);
        initializeMap(userLoc);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        // Default to Delhi if geolocation fails
        const defaultLoc: [number, number] = [77.2090, 28.6139];
        setUserLocation(defaultLoc);
        initializeMap(defaultLoc);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const initializeMap = (center: [number, number]) => {
    if (!mapContainer.current) return;

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
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
          layers: [{
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm-tiles'
          }]
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
        if (!map.current) return;
        
        setMapLoaded(true);
        setMapError(null);
        
        // Add route layer for when pickup and destination are set
        map.current.addSource('route', {
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

        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 5,
            'line-opacity': 0.8
          }
        });

        // Add route animation layer
        map.current.addLayer({
          id: 'route-animation',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#ffffff',
            'line-width': 3,
            'line-dasharray': [2, 4],
            'line-opacity': 0.9
          }
        });
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Failed to load map. Please check your internet connection.');
      });

    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Failed to initialize map.');
    }
  };

  const addUserLocationMarker = (location: [number, number]) => {
    if (!map.current) return;

    // Create custom user location marker with ripple effect
    const userEl = document.createElement('div');
    userEl.innerHTML = `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 bg-blue-500 rounded-full animate-ping opacity-75"></div>
        <div class="absolute w-6 h-6 bg-blue-400 rounded-full animate-ping opacity-50 animation-delay-75"></div>
        <div class="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg z-10"></div>
      </div>
    `;

    const marker = new maplibregl.Marker({ element: userEl })
      .setLngLat(location)
      .addTo(map.current);

    setUserMarker(marker);
  };

  const generateNearbyDrivers = (center: [number, number]) => {
    const drivers = [];
    const vehicleTypes = ['bike', 'auto', 'taxi', 'suv'];
    const driverNames = ['Rajesh Kumar', 'Priya Sharma', 'Mohammad Ali', 'Sita Devi', 'Arjun Singh', 'Kavitha Nair', 'Suresh Patel'];

    for (let i = 0; i < 7; i++) {
      // Generate random location within 5km radius
      const randomAngle = Math.random() * 2 * Math.PI;
      const randomDistance = Math.random() * 0.05; // ~5km in degrees

      const driverLocation: [number, number] = [
        center[0] + Math.cos(randomAngle) * randomDistance,
        center[1] + Math.sin(randomAngle) * randomDistance
      ];

      drivers.push({
        id: `driver-${i}`,
        name: driverNames[i] || `Driver ${i + 1}`,
        vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
        location: driverLocation,
        isAvailable: Math.random() > 0.3,
        rating: Number((4.1 + Math.random() * 0.9).toFixed(1)),
        eta: Math.floor(Math.random() * 12) + 2,
        vehicleNumber: `DL ${Math.floor(Math.random() * 99)}X ${Math.floor(Math.random() * 9999)}`,
        fare: Math.floor(Math.random() * 100) + 50
      });
    }

    setNearbyDrivers(drivers);
    addDriverMarkers(drivers);
  };

  const addDriverMarkers = (drivers: any[]) => {
    if (!map.current) return;

    // Clear existing markers
    driverMarkers.forEach(marker => marker.remove());

    const newMarkers = drivers.map(driver => {
      const vehicleIcon = getVehicleIcon(driver.vehicleType);
      const availabilityColor = driver.isAvailable ? '#10b981' : '#6b7280';

      const el = document.createElement('div');
      el.innerHTML = `
        <div class="relative cursor-pointer transition-all duration-300 hover:scale-110">
          <div class="w-10 h-10 rounded-full border-3 border-white shadow-lg flex items-center justify-center text-lg" 
               style="background-color: ${availabilityColor}">
            ${vehicleIcon}
          </div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center">
            <div class="w-2 h-2 rounded-full ${driver.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}"></div>
          </div>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(driver.location)
        .addTo(map.current!);

      // Enhanced popup with driver info
      const popup = new maplibregl.Popup({ offset: 25, className: 'driver-popup' }).setHTML(`
        <div class="p-4 min-w-52">
          <div class="flex items-center gap-3 mb-3">
            <div class="text-xl">${vehicleIcon}</div>
            <div>
              <div class="font-bold text-gray-900">${driver.name}</div>
              <div class="text-sm text-gray-600">${driver.vehicleNumber}</div>
            </div>
          </div>
          <div class="space-y-2 mb-3">
            <div class="text-sm flex justify-between">
              <span class="text-gray-600">Vehicle:</span>
              <span class="font-medium">${driver.vehicleType.toUpperCase()}</span>
            </div>
            <div class="text-sm flex justify-between">
              <span class="text-gray-600">Rating:</span>
              <span class="font-medium">⭐ ${driver.rating}</span>
            </div>
            <div class="text-sm flex justify-between">
              <span class="text-gray-600">ETA:</span>
              <span class="font-medium">${driver.eta} mins</span>
            </div>
            <div class="text-sm flex justify-between">
              <span class="text-gray-600">Fare:</span>
              <span class="font-medium text-green-600">₹${driver.fare}</span>
            </div>
          </div>
          <div class="text-center">
            <div class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
              driver.isAvailable 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600'
            }">
              <div class="w-2 h-2 rounded-full ${driver.isAvailable ? 'bg-green-500' : 'bg-gray-400'}"></div>
              ${driver.isAvailable ? 'Available Now' : 'On Trip'}
            </div>
          </div>
        </div>
      `);

      marker.setPopup(popup);
      return marker;
    });

    setDriverMarkers(newMarkers);

    // Start driver movement simulation
    setTimeout(() => simulateDriverMovement(), 4000);
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bike': return '🏍️';
      case 'auto': return '🛺';
      case 'taxi': return '🚗';
      case 'suv': return '🚙';
      default: return '🚗';
    }
  };

  const simulateDriverMovement = () => {
    if (!map.current) return;

    setNearbyDrivers(prev => {
      const updatedDrivers = prev.map(driver => {
        if (Math.random() > 0.4) { // 60% chance to move
          const currentLoc = driver.location;
          const moveDistance = 0.001; // Realistic movement
          const angle = Math.random() * 2 * Math.PI;

          return {
            ...driver,
            location: [
              currentLoc[0] + Math.cos(angle) * moveDistance,
              currentLoc[1] + Math.sin(angle) * moveDistance
            ],
            eta: Math.max(1, driver.eta + (Math.random() > 0.5 ? 1 : -1))
          };
        }
        return driver;
      });

      // Update markers with new positions
      addDriverMarkers(updatedDrivers);
      return updatedDrivers;
    });

    // Continue simulation
    setTimeout(() => simulateDriverMovement(), 8000);
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
      if (!map.current || !mapLoaded) return;

      // Update pickup marker
      if (pickup) {
        const pickupCoords = await geocodeLocation(pickup);
        if (pickupCoords) {
          if (pickupMarker) pickupMarker.remove();

          const pickupEl = document.createElement('div');
          pickupEl.innerHTML = `
            <div class="flex flex-col items-center">
              <div class="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-xl mb-2 whitespace-nowrap border-2 border-white">
                📍 Pickup
              </div>
              <div class="w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg animate-bounce"></div>
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
              <div class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-xl mb-2 whitespace-nowrap border-2 border-white">
                🎯 Drop
              </div>
              <div class="w-6 h-6 bg-red-500 rounded-full border-3 border-white shadow-lg animate-bounce"></div>
            </div>
          `;

          const newDestMarker = new maplibregl.Marker({ element: destEl })
            .setLngLat(destCoords)
            .addTo(map.current);

          setDestinationMarker(newDestMarker);
        }
      }

      // Draw route if both locations exist
      if (pickup && destination && map.current.getSource('route')) {
        const pickupCoords = await geocodeLocation(pickup);
        const destCoords = await geocodeLocation(destination);

        if (pickupCoords && destCoords) {
          // Create a more realistic curved route using turf.js
          const route = turf.greatCircle(
            turf.point(pickupCoords),
            turf.point(destCoords),
            { npoints: 150 }
          );

          setRouteData(route);
          (map.current.getSource('route') as maplibregl.GeoJSONSource).setData(route);

          // Fit map to show both points with padding
          const bounds = new maplibregl.LngLatBounds()
            .extend(pickupCoords)
            .extend(destCoords);

          map.current.fitBounds(bounds, { padding: 100, duration: 1500 });
        }
      }
    };

    updateMarkers();
  }, [pickup, destination, mapLoaded]);

  const centerToUserLocation = () => {
    if (map.current && userLocation) {
      map.current.easeTo({
        center: userLocation,
        zoom: 15,
        duration: 2000,
        essential: true
      });
    }
  };

  const availableDriversCount = nearbyDrivers.filter(d => d.isAvailable).length;
  const totalDriversCount = nearbyDrivers.length;

  if (mapError) {
    return (
      <Card className="border-0 shadow-xl overflow-hidden bg-white">
        <div className="flex items-center justify-center h-96 bg-gray-50">
          <div className="text-center p-6">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Loading Failed</h3>
            <p className="text-gray-600 mb-4">{mapError}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl overflow-hidden bg-white">
      <div className="relative">
        <div 
          ref={mapContainer} 
          className="w-full h-96 bg-gray-100 relative"
          style={{ minHeight: '384px' }}
        />
        
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={centerToUserLocation}
            className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border-0"
            title="Center to my location"
          >
            <Navigation className="h-4 w-4 text-blue-600" />
          </Button>
        </div>

        {nearbyDrivers.length > 0 && mapLoaded && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-2xl">🚗</div>
              <div>
                <div className="text-sm font-bold text-gray-900">
                  {availableDriversCount} of {totalDriversCount} drivers nearby
                </div>
                <div className="text-xs text-gray-600">
                  ₹50-200 estimated fare range
                </div>
              </div>
            </div>
            <div className="flex gap-1 flex-wrap">
              {nearbyDrivers.slice(0, 4).map((driver, index) => (
                <div 
                  key={driver.id}
                  className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                >
                  {getVehicleIcon(driver.vehicleType)} {driver.eta}min
                </div>
              ))}
            </div>
          </div>
        )}

        {routeData && mapLoaded && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg">
            <div className="text-xs font-medium">
              🛣️ Route Active
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RealisticMapComponent;
