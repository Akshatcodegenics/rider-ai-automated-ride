import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import * as turf from '@turf/turf';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapStyles.css';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation, Car, MapPin, AlertTriangle, Route, Zap, Badge } from "lucide-react";

interface RealisticMapComponentProps {
  pickup?: string;
  destination?: string;
  onLocationSelect?: (location: { pickup?: string; destination?: string }) => void;
  selectedRoute?: any;
  showTraffic?: boolean;
  weatherCondition?: 'clear' | 'rain' | 'fog';
}

const RealisticMapComponent = ({ 
  pickup, 
  destination, 
  onLocationSelect, 
  selectedRoute,
  showTraffic = true,
  weatherCondition = 'clear'
}: RealisticMapComponentProps) => {
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
  const [trafficLevel, setTrafficLevel] = useState<'low' | 'medium' | 'high'>('medium');

  // Initialize map with better error handling and weather effects
  useEffect(() => {
    if (!mapContainer.current) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc: [number, number] = [position.coords.longitude, position.coords.latitude];
        setUserLocation(userLoc);
        initializeMap(userLoc);
      },
      (error) => {
        console.warn('Geolocation error:', error);
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
      // Enhanced map style with weather effects
      const mapStyle = {
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
          },
          // Weather overlay
          ...(weatherCondition !== 'clear' ? [{
            id: 'weather-overlay',
            type: 'fill',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [center[0] - 0.1, center[1] - 0.1],
                    [center[0] + 0.1, center[1] - 0.1],
                    [center[0] + 0.1, center[1] + 0.1],
                    [center[0] - 0.1, center[1] + 0.1],
                    [center[0] - 0.1, center[1] - 0.1]
                  ]]
                }
              }
            },
            paint: {
              'fill-color': weatherCondition === 'rain' ? '#4A90E2' : '#9E9E9E',
              'fill-opacity': 0.1
            }
          }] : [])
        ]
      };

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: center,
        zoom: 13,
        attributionControl: false
      });

      // Add enhanced navigation controls
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
      
      // Add scale control
      map.current.addControl(new maplibregl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
      }), 'bottom-left');

      // Add user location marker with enhanced animations
      addUserLocationMarker(center);

      // Generate realistic drivers with AI behavior
      generateSmartDrivers(center);

      map.current.on('load', () => {
        if (!map.current) return;
        
        setMapLoaded(true);
        setMapError(null);
        
        // Add traffic simulation layer
        if (showTraffic) {
          addTrafficLayer();
        }
        
        // Add route layers with animations
        addRouteLayer();
        
        // Add heat map for demand
        addDemandHeatmap(center);
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

  const addTrafficLayer = () => {
    if (!map.current) return;

    // Simulate traffic data
    const trafficRoutes = generateTrafficData();
    
    map.current.addSource('traffic', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: trafficRoutes
      }
    });

    map.current.addLayer({
      id: 'traffic-layer',
      type: 'line',
      source: 'traffic',
      paint: {
        'line-width': 4,
        'line-color': [
          'case',
          ['==', ['get', 'level'], 'high'], '#FF6B6B',
          ['==', ['get', 'level'], 'medium'], '#FFD93D',
          '#6BCF7F'
        ],
        'line-opacity': 0.7
      }
    });
  };

  const generateTrafficData = () => {
    const routes: any[] = [];
    const levels = ['low', 'medium', 'high'];
    
    for (let i = 0; i < 15; i++) {
      const startLng = (userLocation?.[0] || 77.2090) + (Math.random() - 0.5) * 0.02;
      const startLat = (userLocation?.[1] || 28.6139) + (Math.random() - 0.5) * 0.02;
      const endLng = startLng + (Math.random() - 0.5) * 0.01;
      const endLat = startLat + (Math.random() - 0.5) * 0.01;
      
      routes.push({
        type: 'Feature',
        properties: {
          level: levels[Math.floor(Math.random() * levels.length)]
        },
        geometry: {
          type: 'LineString',
          coordinates: [[startLng, startLat], [endLng, endLat]]
        }
      });
    }
    
    return routes;
  };

  const addRouteLayer = () => {
    if (!map.current) return;

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

    // Main route
    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': selectedRoute?.type === 'eco' ? '#10B981' : '#3B82F6',
        'line-width': 6,
        'line-opacity': 0.8
      }
    });

    // Route animation
    map.current.addLayer({
      id: 'route-animation',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#FFFFFF',
        'line-width': 4,
        'line-dasharray': [2, 4],
        'line-opacity': 0.9
      }
    });

    // Route glow effect
    map.current.addLayer({
      id: 'route-glow',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': selectedRoute?.type === 'eco' ? '#10B981' : '#3B82F6',
        'line-width': 12,
        'line-opacity': 0.3,
        'line-blur': 4
      }
    }, 'route');
  };

  const addDemandHeatmap = (center: [number, number]) => {
    if (!map.current) return;

    const heatmapData = {
      type: 'FeatureCollection',
      features: Array.from({ length: 50 }, (_, i) => ({
        type: 'Feature',
        properties: {
          demand: Math.random() * 100
        },
        geometry: {
          type: 'Point',
          coordinates: [
            center[0] + (Math.random() - 0.5) * 0.05,
            center[1] + (Math.random() - 0.5) * 0.05
          ]
        }
      }))
    };

    map.current.addSource('demand-heatmap', {
      type: 'geojson',
      data: heatmapData
    });

    map.current.addLayer({
      id: 'demand-heatmap',
      type: 'heatmap',
      source: 'demand-heatmap',
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'demand'],
          0, 0,
          100, 1
        ],
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          15, 3
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(33,102,172,0)',
          0.2, 'rgb(103,169,207)',
          0.4, 'rgb(209,229,240)',
          0.6, 'rgb(253,219,199)',
          0.8, 'rgb(239,138,98)',
          1, 'rgb(178,24,43)'
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 2,
          15, 20
        ],
        'heatmap-opacity': 0.4
      }
    }, 'waterway-label');
  };

  const addUserLocationMarker = (location: [number, number]) => {
    if (!map.current) return;

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

  const generateSmartDrivers = (center: [number, number]) => {
    const drivers = [];
    const vehicleTypes = ['bike', 'auto', 'taxi', 'suv', 'luxury'];
    const driverNames = ['Rajesh Kumar', 'Priya Sharma', 'Mohammad Ali', 'Sita Devi', 'Arjun Singh', 'Kavitha Nair', 'Suresh Patel'];
    const routes = ['Airport Route', 'City Center', 'Mall Road', 'Tech Park', 'Railway Station'];

    for (let i = 0; i < 8; i++) {
      const randomAngle = Math.random() * 2 * Math.PI;
      const randomDistance = Math.random() * 0.05;

      const driverLocation: [number, number] = [
        center[0] + Math.cos(randomAngle) * randomDistance,
        center[1] + Math.sin(randomAngle) * randomDistance
      ];

      drivers.push({
        id: `driver-${i}`,
        name: driverNames[i] || `Driver ${i + 1}`,
        vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
        location: driverLocation,
        isAvailable: Math.random() > 0.2,
        rating: Number((4.1 + Math.random() * 0.9).toFixed(1)),
        eta: Math.floor(Math.random() * 12) + 2,
        vehicleNumber: `DL ${Math.floor(Math.random() * 99)}X ${Math.floor(Math.random() * 9999)}`,
        fare: Math.floor(Math.random() * 100) + 50,
        currentRoute: routes[Math.floor(Math.random() * routes.length)],
        speed: Math.floor(Math.random() * 40) + 20, // km/h
        completedTrips: Math.floor(Math.random() * 500) + 50,
        isEcoFriendly: Math.random() > 0.6,
        acceptsPets: Math.random() > 0.7,
        hasAC: Math.random() > 0.3,
        safetyScore: Number((4.0 + Math.random() * 1.0).toFixed(1)),
        behaviorPattern: Math.random() > 0.5 ? 'aggressive' : 'conservative'
      });
    }

    setNearbyDrivers(drivers);
    addSmartDriverMarkers(drivers);
  };

  const addSmartDriverMarkers = (drivers: any[]) => {
    if (!map.current) return;

    driverMarkers.forEach(marker => marker.remove());

    const newMarkers = drivers.map(driver => {
      const vehicleIcon = getVehicleIcon(driver.vehicleType);
      const availabilityColor = driver.isAvailable ? '#10b981' : '#6b7280';

      const el = document.createElement('div');
      el.innerHTML = `
        <div class="relative cursor-pointer transition-all duration-300 hover:scale-110 driver-marker" data-driver-id="${driver.id}">
          <div class="w-12 h-12 rounded-full border-3 border-white shadow-xl flex items-center justify-center text-lg animate-bounce" 
               style="background: linear-gradient(135deg, ${availabilityColor}, ${driver.isEcoFriendly ? '#10b981' : availabilityColor})">
            ${vehicleIcon}
          </div>
          <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center">
            <div class="w-3 h-3 rounded-full ${driver.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}"></div>
          </div>
          ${driver.speed > 30 ? '<div class="absolute -top-1 -left-1 text-xs">💨</div>' : ''}
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(driver.location)
        .addTo(map.current!);

      // Enhanced popup with comprehensive driver info
      const popup = new maplibregl.Popup({ 
        offset: 25, 
        className: 'driver-popup',
        maxWidth: '300px'
      }).setHTML(`
        <div class="p-4 min-w-64">
          <div class="flex items-center gap-3 mb-3">
            <div class="text-2xl">${vehicleIcon}</div>
            <div class="flex-1">
              <div class="font-bold text-gray-900">${driver.name}</div>
              <div class="text-sm text-gray-600">${driver.vehicleNumber}</div>
              <div class="text-xs text-blue-600">${driver.currentRoute}</div>
            </div>
            <div class="text-right">
              <div class="text-sm font-bold text-green-600">₹${driver.fare}</div>
              <div class="text-xs text-gray-500">${driver.eta} mins</div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-3 mb-3 text-xs">
            <div class="flex items-center gap-1">
              <span class="text-yellow-500">⭐</span>
              <span>${driver.rating}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-blue-500">🛡️</span>
              <span>${driver.safetyScore}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-purple-500">🚗</span>
              <span>${driver.completedTrips} trips</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-red-500">🏃</span>
              <span>${driver.speed} km/h</span>
            </div>
          </div>
          
          <div class="flex gap-1 mb-3">
            ${driver.isEcoFriendly ? '<span class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">🌱 Eco</span>' : ''}
            ${driver.acceptsPets ? '<span class="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">🐕 Pets</span>' : ''}
            ${driver.hasAC ? '<span class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">❄️ AC</span>' : ''}
          </div>
          
          <div class="text-center">
            <div class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
              driver.isAvailable 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600'
            }">
              <div class="w-2 h-2 rounded-full ${driver.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}"></div>
              ${driver.isAvailable ? 'Available Now' : 'On Trip'}
            </div>
          </div>
        </div>
      `);

      marker.setPopup(popup);
      return marker;
    });

    setDriverMarkers(newMarkers);

    // Start intelligent driver movement simulation
    setTimeout(() => simulateIntelligentDriverMovement(), 3000);
  };

  const simulateIntelligentDriverMovement = () => {
    if (!map.current) return;

    setNearbyDrivers(prev => {
      const updatedDrivers = prev.map(driver => {
        if (Math.random() > 0.3) { // 70% chance to move based on behavior
          const currentLoc = driver.location;
          let moveDistance = 0.0005; // Base movement
          
          // Adjust movement based on behavior pattern
          if (driver.behaviorPattern === 'aggressive') {
            moveDistance *= 1.5;
          }
          
          // Move towards high-demand areas (simulate intelligent routing)
          const angle = Math.random() * 2 * Math.PI;
          const demandInfluence = Math.random() > 0.6 ? 0.001 : 0;

          return {
            ...driver,
            location: [
              currentLoc[0] + Math.cos(angle) * (moveDistance + demandInfluence),
              currentLoc[1] + Math.sin(angle) * (moveDistance + demandInfluence)
            ],
            eta: Math.max(1, driver.eta + (Math.random() > 0.5 ? 1 : -1)),
            speed: Math.max(15, Math.min(60, driver.speed + (Math.random() - 0.5) * 10)),
            isAvailable: Math.random() > 0.1 ? driver.isAvailable : !driver.isAvailable
          };
        }
        return driver;
      });

      // Update markers with smooth animations
      addSmartDriverMarkers(updatedDrivers);
      return updatedDrivers;
    });

    // Continue intelligent simulation
    setTimeout(() => simulateIntelligentDriverMovement(), 5000);
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bike': return '🏍️';
      case 'auto': return '🛺';
      case 'taxi': return '🚗';
      case 'suv': return '🚙';
      case 'luxury': return '🏎️';
      default: return '🚗';
    }
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
            <div class="flex flex-col items-center animate-bounce">
              <div class="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-xl mb-2 whitespace-nowrap border-2 border-white">
                📍 Pickup
              </div>
              <div class="w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg relative">
                <div class="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-50"></div>
              </div>
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
            <div class="flex flex-col items-center animate-bounce">
              <div class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-xl mb-2 whitespace-nowrap border-2 border-white">
                🎯 Destination
              </div>
              <div class="w-6 h-6 bg-red-500 rounded-full border-3 border-white shadow-lg relative">
                <div class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-50"></div>
              </div>
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
            { npoints: 100 }
          );

          setRouteData(route);
          (map.current.getSource('route') as maplibregl.GeoJSONSource).setData(route);

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
  const averageETA = Math.round(nearbyDrivers.reduce((sum, d) => sum + d.eta, 0) / nearbyDrivers.length);

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
              <p className="text-gray-600">Loading intelligent map...</p>
            </div>
          </div>
        )}
        
        {/* Enhanced control buttons */}
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
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setTrafficLevel(prev => 
              prev === 'low' ? 'medium' : prev === 'medium' ? 'high' : 'low'
            )}
            className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border-0"
            title="Toggle traffic view"
          >
            <Route className="h-4 w-4 text-orange-600" />
          </Button>
        </div>

        {/* Weather indicator */}
        {weatherCondition !== 'clear' && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-xl border border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {weatherCondition === 'rain' ? '🌧️' : '🌫️'}
              </span>
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {weatherCondition === 'rain' ? 'Rainy Conditions' : 'Foggy Weather'}
                </div>
                <div className="text-xs text-gray-600">Drive safely</div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced driver info panel */}
        {nearbyDrivers.length > 0 && mapLoaded && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200 max-w-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl">🚗</div>
              <div>
                <div className="text-sm font-bold text-gray-900">
                  {availableDriversCount} drivers nearby
                </div>
                <div className="text-xs text-gray-600">
                  Average ETA: {averageETA} minutes
                </div>
              </div>
            </div>
            
            <div className="flex gap-1 flex-wrap mb-2">
              {nearbyDrivers.slice(0, 4).map((driver, index) => (
                <Badge 
                  key={driver.id}
                  variant="secondary" 
                  className={`text-xs ${driver.isEcoFriendly ? 'bg-green-100 text-green-700' : ''}`}
                >
                  {getVehicleIcon(driver.vehicleType)} {driver.eta}min
                </Badge>
              ))}
            </div>
            
            <div className="text-xs text-gray-500">
              Traffic: <span className={`font-medium ${
                trafficLevel === 'low' ? 'text-green-600' : 
                trafficLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
              }`}>{trafficLevel}</span>
            </div>
          </div>
        )}

        {/* Route indicator */}
        {routeData && mapLoaded && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="text-xs font-medium flex items-center gap-2">
              <Zap className="h-3 w-3" />
              {selectedRoute?.name || 'Active Route'}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RealisticMapComponent;
