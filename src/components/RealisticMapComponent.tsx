
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapStyles.css';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation, Car, MapPin, AlertTriangle, Route, Zap } from "lucide-react";

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
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize map with better error handling
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
      const mapStyle: maplibregl.StyleSpecification = {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
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
      };

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: center,
        zoom: 13,
        attributionControl: false
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      // Add user location marker
      addUserLocationMarker(center);

      // Generate nearby drivers
      generateNearbyDrivers(center);

      map.current.on('load', () => {
        setMapLoaded(true);
        setMapError(null);
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Failed to load map. Please refresh the page.');
      });

    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Failed to initialize map.');
    }
  };

  const addUserLocationMarker = (location: [number, number]) => {
    if (!map.current) return;

    const userEl = document.createElement('div');
    userEl.className = 'user-location-marker';
    userEl.innerHTML = `
      <div style="position: relative; width: 20px; height: 20px;">
        <div style="position: absolute; width: 20px; height: 20px; background: #3B82F6; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
        <div style="position: absolute; width: 40px; height: 40px; background: rgba(59, 130, 246, 0.3); border-radius: 50%; top: -10px; left: -10px; animation: pulse 2s infinite;"></div>
      </div>
    `;

    const marker = new maplibregl.Marker({ element: userEl })
      .setLngLat(location)
      .addTo(map.current);

    setUserMarker(marker);
  };

  const generateNearbyDrivers = (center: [number, number]) => {
    const drivers = [];
    const vehicleTypes = ['🚗', '🚙', '🛺', '🏍️'];

    for (let i = 0; i < 5; i++) {
      const randomAngle = Math.random() * 2 * Math.PI;
      const randomDistance = Math.random() * 0.01;

      const driverLocation: [number, number] = [
        center[0] + Math.cos(randomAngle) * randomDistance,
        center[1] + Math.sin(randomAngle) * randomDistance
      ];

      const driver = {
        id: `driver-${i}`,
        name: `Driver ${i + 1}`,
        vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
        location: driverLocation,
        isAvailable: Math.random() > 0.3,
        rating: Number((4.1 + Math.random() * 0.9).toFixed(1)),
        eta: Math.floor(Math.random() * 10) + 2
      };

      drivers.push(driver);
    }

    setNearbyDrivers(drivers);
    addDriverMarkers(drivers);
  };

  const addDriverMarkers = (drivers: any[]) => {
    if (!map.current) return;

    // Remove existing driver markers
    driverMarkers.forEach(marker => marker.remove());

    const newMarkers = drivers.map(driver => {
      const el = document.createElement('div');
      el.className = 'driver-marker';
      el.style.position = 'relative';
      el.style.width = '30px';
      el.style.height = '30px';
      el.innerHTML = `
        <div style="position: relative; width: 30px; height: 30px; background: ${driver.isAvailable ? '#10B981' : '#6B7280'}; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; font-size: 14px;">
          ${driver.vehicleType}
        </div>
        <div style="position: absolute; bottom: -2px; right: -2px; width: 10px; height: 10px; background: ${driver.isAvailable ? '#10B981' : '#6B7280'}; border-radius: 50%; border: 1px solid white;"></div>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(driver.location)
        .addTo(map.current!);

      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px; min-width: 150px;">
          <div style="font-weight: bold; margin-bottom: 4px;">${driver.name}</div>
          <div style="font-size: 12px; color: #666; margin-bottom: 4px;">⭐ ${driver.rating} • ${driver.eta} mins</div>
          <div style="font-size: 11px; color: ${driver.isAvailable ? '#10B981' : '#6B7280'};">
            ${driver.isAvailable ? '✅ Available' : '🚫 Busy'}
          </div>
        </div>
      `);

      marker.setPopup(popup);
      return marker;
    });

    setDriverMarkers(newMarkers);
  };

  const centerToUserLocation = () => {
    if (map.current && userLocation) {
      map.current.easeTo({
        center: userLocation,
        zoom: 15,
        duration: 1000
      });
    }
  };

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
        
        <div className="absolute top-4 right-4">
          <Button
            size="sm"
            variant="outline"
            onClick={centerToUserLocation}
            className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border-0"
          >
            <Navigation className="h-4 w-4 text-blue-600" />
          </Button>
        </div>

        {nearbyDrivers.length > 0 && mapLoaded && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🚗</div>
              <div>
                <div className="text-sm font-bold text-gray-900">
                  {nearbyDrivers.filter(d => d.isAvailable).length} drivers nearby
                </div>
                <div className="text-xs text-gray-600">
                  Average ETA: {Math.round(nearbyDrivers.reduce((sum, d) => sum + d.eta, 0) / nearbyDrivers.length)} mins
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RealisticMapComponent;
